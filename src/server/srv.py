from flask import Flask, request, jsonify, abort, make_response, g
import mysql.connector, mysql.connector.pooling
import json
import uuid
import bcrypt
from time import time
from dotenv import load_dotenv
load_dotenv()
import os


#from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask import render_template
from flask_mail import Message
from threading import Thread
import jwt


pool = mysql.connector.pooling.MySQLConnectionPool(
	host = "localhost",
	user = "root",
	passwd = os.getenv("DATABASE_PASSWORD"),
	database = os.getenv("DATABASE_NAME"),
	buffered = True,
	pool_size = 10,
	pool_name = "my_pool"
)

app = Flask(__name__,
			static_folder='../Frontend/build',
			static_url_path='/')

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
mail = Mail(app)


@app.before_request
def before_request():
	g.db = pool.get_connection()

@app.teardown_request
def teardown_request(exception):
	g.db.close()

@app.route("/api/alive")
def alive():
	return "alive"

@app.route('/')
def index():
	return app.send_static_file('index.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
	data = request.get_json()
	query = "select id, password, first_name, email, role, img_src from users where username = %s"
	values = (data['username'], )
	cursor = g.db.cursor()
	cursor.execute(query, values)
	record = cursor.fetchone()
	if not record:
		abort(401)
	user_id, first_name, email, role, img_src, username = record[0], record[2], record[3], record[4], record[5], data['username']
	hashed_pwd = record[1].encode('utf-8')
	if bcrypt.hashpw(data['password'].encode('utf-8'), hashed_pwd) != hashed_pwd:
		abort(401)
	session_id = str(uuid.uuid4())
	query = "insert into sessions (user_id, session_id) values (%s, %s) on duplicate key update session_id=%s"
	values = (user_id, session_id, session_id)
	cursor.execute(query, values)
	g.db.commit()
	user_data = {"user_id": user_id, "first_name": first_name, "username": username , "email": email, "img_src" :img_src, "role": role}
	resp = make_response(user_data)
	resp.set_cookie("session_id", session_id)
	return resp

@app.route('/logout', methods=['POST'])
def logout():
	validate_session = json.loads(user())
	user_id = validate_session["user_id"]
	query = "delete from sessions where user_id=%s"
	value = (user_id,)
	cursor = g.db.cursor()
	cursor.execute(query, value)
	g.db.commit()
	cursor.close()
	resp = make_response()
	resp.set_cookie("session_id", '', expires=0)
	return resp


@app.route('/user', methods=['GET'])
def user():
	session_id = request.cookies.get("session_id")
	if session_id is None:
		abort(401)
	query = "select id, first_name, last_name, username, email, img_src, role from users inner join sessions on users.id=sessions.user_id where sessions.session_id=%s"
	cursor = g.db.cursor()
	value = (session_id,)
	cursor.execute(query, value)
	records = cursor.fetchall()
	header = ['user_id', 'first_name', 'last_name', 'username', 'email', 'img_src', 'role']
	data = dict(zip(header,records[0]))
	user_data = json.dumps(data, default=str)
	return user_data


@app.route('/register', methods=['POST'])
def register():
	data = request.get_json()
	query = "select id from users where username = (%s)"
	value = (data['username'], )
	cursor = g.db.cursor()
	cursor.execute(query, value)
	records = cursor.fetchall()
	print(records)
	if records:
		response = jsonify({'username': 'Username already taken'})
		response.status_code = 400
		return response
	cursor.close()
	cursor = g.db.cursor()
	query = "select id from users where email = (%s)"
	value = (data['email'], )
	cursor.execute(query, value)
	records = cursor.fetchall()
	print(records)
	if records:
		response = jsonify({'email': 'Email exists in the database'})
		response.status_code = 400
		return response
	hashed_pwd = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
	query = "insert into users (first_name, last_name, email, username, img_src, password) values (%s, %s, %s, %s, %s, %s)"
	values = (data['first_name'], data['last_name'], data['email'], data['username'], data['img_src'], hashed_pwd)
	cursor.execute(query, values)
	g.db.commit()
	new_user_id = cursor.lastrowid
	cursor.close()
	return 'New user id: ' + str(new_user_id)

@app.route('/posts', methods=['GET', 'POST'])

def manage_posts_requests():
	if request.method == 'GET':
		return get_all_posts()
	else:
		return add_post()

def add_post():
	data = request.get_json()
	user_data = user()
	json_user_data = json.loads(user_data)
	author = json_user_data['first_name']
	query = "insert into posts (title, content, author) values (%s, %s, %s)"
	values = (data['title'], data['content'], author)
	cursor = g.db.cursor()
	cursor.execute(query, values)
	g.db.commit()
	new_post_id = cursor.lastrowid
	query = "insert into tag_post (tag_id, post_id) values (%s, %s)"
	for tag_id in data['tags_selection']:
		values = [int(tag_id), int(new_post_id)]
		cursor.execute(query, values)
	g.db.commit()
	cursor.close()
	return 'New post id: ' + str(new_post_id)


def get_all_posts():
	query = "select id, title, content, author, published_at, views from posts"
	data = []
	cursor = g.db.cursor()
	cursor.execute(query)
	records = cursor.fetchall()
	header = ['id', 'title', 'content', 'author', 'published_at', 'views']
	for r in records:
		data.append(dict(zip(header, r)))
	cursor.close()
	return json.dumps(data, default=str)


@app.route('/posts/<id>', methods=['GET','POST','PUT','DELETE'])
def manage_posts_by_ID_requests(id):
	if request.method == 'GET':
		return get_post_and_comments_by_ID(id)
	elif request.method == 'PUT':
		return edit_post(id)
	elif request.method == 'DELETE':
		return delete_post(id)
	elif request.method == 'POST':
		return add_view_to_post(id)

def get_post_and_comments_by_ID(id):
	query = "select id, title, content, author, published_at from posts where id=%s"
	value =(id,)
	cursor = g.db.cursor()
	cursor.execute(query,value)
	records = cursor.fetchall()
	header = ['id', 'title', 'content', 'author', 'published_at']
	post_json = dict(zip(header,records[0]))

	query = "select comment, author, published_at, img_src from comments where post_id=%s"
	cursor.execute(query, value)
	records = cursor.fetchall()
	header = ['comment', 'author', 'published_at', 'img_src']
	comments = []
	for r in records:
		comments.append(dict(zip(header, r)))

	query = "select tag_id from tag_post where post_id=%s"
	cursor.execute(query, value)
	records = cursor.fetchall()
	header = ['tag_id']
	tags = []
	for r in records:
		tags.append(dict(zip(header, r)))
	cursor.close()
	post_json["comments"] = comments
	post_json["tags"] = tags
	post_json = json.dumps(post_json, default=str)

	return post_json

def edit_post(id):
	data = request.get_json()
	query = "update posts set title=%s, content=%s where id=%s"
	values = (data['title'], data['content'], id)
	cursor = g.db.cursor()
	cursor.execute(query, values)
	if (data['tags_selection'] != [] ):
		if type(data['tags_selection'][0]) is not dict:
			query = "delete from tag_post where post_id=%s"
			values = (id,)
			cursor.execute(query, values)
			query = "insert into tag_post (tag_id, post_id) values (%s, %s)"
			for tag_id in data['tags_selection']:
				values = (tag_id, id)
				cursor.execute(query, values)
	g.db.commit()
	cursor.close()
	return 'post updated'

def delete_post(id):
	query = "delete from posts where id=%s"
	values = (id, )
	cursor = g.db.cursor()
	cursor.execute(query,values)
	g.db.commit()
	cursor.close()
	data = get_all_posts()
	return data

def add_view_to_post(id):
	query = "update posts set views = views + 1 where id=%s"
	cursor = g.db.cursor()
	value = (id,)
	cursor.execute(query, value)
	g.db.commit()
	cursor.close()
	return 'view added'

@app.route('/popular', methods=['GET'])
def get_most_popular_posts():
	query = "select id, title, content, author, published_at from posts order by views desc limit 3"
	data = []
	cursor = g.db.cursor()
	cursor.execute(query)
	records = cursor.fetchall()
	header = ['id', 'title', 'content', 'author', 'published_at', 'views']
	for r in records:
		data.append(dict(zip(header, r)))
	cursor.close()
	return json.dumps(data, default=str)


@app.route('/recent', methods=['GET'])
def get_most_recent_posts():
	query = "select id, title, content, author, published_at from posts order by published_at desc limit 3"
	data = []
	cursor = g.db.cursor()
	cursor.execute(query)
	records = cursor.fetchall()
	header = ['id', 'title', 'content', 'author', 'published_at', 'views']
	for r in records:
		data.append(dict(zip(header, r)))
	cursor.close()
	return json.dumps(data, default=str)


@app.route('/comments', methods=['POST'])

def add_comment():
	data = request.get_json()
	query = "insert into comments (post_id, comment, author, img_src) values (%s, %s, %s, %s)"
	values = (data['post_id'], data['comment'], data['username'], data['img_src'])
	cursor = g.db.cursor()
	cursor.execute(query, values)
	g.db.commit()
	new_comment_id = cursor.lastrowid
	value = (new_comment_id,)
	query = "select comment, author, published_at, img_src from comments where id=%s"
	cursor.execute(query, value)
	records = cursor.fetchall()
	cursor.close()
	header = ['comment', 'author', 'published_at', 'img_src']
	comment = dict(zip(header,records[0]))
	comment_json = json.dumps(comment, default=str)
	return comment_json

@app.route('/search/<input>', methods=['GET'])

def get_search_results(input):
	query = "select id, title, content, author, published_at from posts where content like %s"
	#value =( '%' + input + '%' , '%' + input + '%')
	cursor = g.db.cursor()
	cursor.execute(query, ("%" + input + "%",))
	records = cursor.fetchall()
	header = ['id', 'title', 'content', 'author', 'published_at']
	search_results = []
	for r in records:
		search_results.append(dict(zip(header, r)))
	cursor.close()
	return json.dumps(search_results, default=str)


@app.route('/forgotPassword' , methods=['POST'])

def check_email():
	data = request.get_json()
	query = "select id from users where email = (%s)"
	value = (data['email'], )
	cursor = g.db.cursor()
	cursor.execute(query, value)
	records = cursor.fetchall()
	if records == []:
		abort(401)
	rec = [i[0] for i in records]
	id = rec[0]
	send_email(id, data['email'])
	return "recovery email sent"


def get_reset_token(id, expires=500):
	username = get_username_by_id(id)
	key = os.getenv("SECRET_KEY")
	return jwt.encode({'reset_password': username,
					   'exp':    time() + expires
					   },
					  key, algorithm='HS256').decode('utf-8')


def send_email(id, user_email):
	url = 'http://localhost:3000/reset/'
	token = str(get_reset_token(id))
	msg = Message()
	msg.subject = "Flask App Password Reset"
	msg.recipients = [user_email]
	msg.sender = 'daniel_tubul_blog_support@gmail.com'
	msg.html = render_template('reset_email.html', url=url + token)
	print(url+token)
	mail.send(msg)

def get_username_by_id(id):
	query = "select username from users where id=%s"
	value = (id, )
	cursor = g.db.cursor()
	cursor.execute(query, value)
	records = cursor.fetchall()
	rec = [i[0] for i in records]
	username = rec[0]
	cursor.close()
	return username


@app.route('/reset/<token>', methods=['GET'])
def verify_reset_token(token):
	key = os.getenv("SECRET_KEY")
	try:
		username = jwt.decode(token, key, algorithms='HS256')['reset_password']
	except jwt.ExpiredSignatureError:
		response = jsonify('The link is no longer valid')
		response.status_code = 400
		return response
	except jwt.DecodeError:
		response = jsonify('Error decoding the token')
		response.status_code = 400
		return response
	if username_is_valid(username):
		return username
	else:
		abort(401)

def username_is_valid(username):
	query = "select id from users where username=%s"
	value = (username,)
	cursor = g.db.cursor()
	cursor.execute(query,value)
	records = cursor.fetchall()
	if records == []:
		return False
	else:
		return True

@app.route('/password', methods=['PUT'])
def update_password():
	data = request.get_json()
	hashed_pwd = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
	query = "update users set password=%s where username=%s"
	values = (hashed_pwd, data['username'],)
	cursor = g.db.cursor()
	cursor.execute(query, values)
	cursor.close()
	g.db.commit()
	return 'password updated'


@app.route('/tags', methods=['GET', 'POST', 'DELETE'])
def manage_tag_requests():
	if request.method == 'GET':
		return get_all_tags()
	elif request.method == 'POST':
		return add_tag()


def add_tag():
	data = request.get_json()
	query = "insert into tags (name) value (%s)"
	value = (data['tag_name'], )
	cursor = g.db.cursor()
	cursor.execute(query, value)
	g.db.commit()
	new_tag_id = cursor.lastrowid
	value = (new_tag_id, )
	query = "select id, name from tags where id=%s"
	cursor.execute(query, value)
	records = cursor.fetchall()
	cursor.close()
	header = ['value','label']
	tag = dict(zip(header,records[0]))
	tag_json = json.dumps(tag, default=str)
	return tag_json


def get_all_tags():
	query = "select id, name from tags"
	data = []
	cursor = g.db.cursor()
	cursor.execute(query)
	records = cursor.fetchall()
	header = ['value', 'label']
	for r in records:
		data.append(dict(zip(header, r)))
	cursor.close()
	return json.dumps(data, default=str)



@app.route('/tag/<id>', methods=['DELETE'])
def delete_tag(id):
	query = "delete from tags where id=%s"
	values = (id, )
	cursor = g.db.cursor()
	cursor.execute(query,values)
	query = "delete from tag_post where tag_id=%s"
	cursor.execute(query, values)
	g.db.commit()
	cursor.close()
	data = get_all_tags()
	return data


if __name__ == "__main__":
	app.run()