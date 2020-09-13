import React from "react";
import {Container, Grid, Header,Divider, Image} from "semantic-ui-react";
import Popular from "../Components/Popular";
import Typewriter from 'typewriter-effect';


function AboutMe(){
    return (
        <div>
            <Grid celled padded={"false"}>
                <Grid.Column width ={1} style={{background: '#fafafa'}}></Grid.Column>
                <Grid.Column width={10} >
                    <Container style={styles.container}>
                        <Header as="h2">About</Header>
                        <Divider/>
                        <Typewriter
                            options={{
                                strings: ["Hi! ... I'm <strong> Daniel Tubul </strong>"],
                                autoStart: true,
                                delay: "30",
                                deleteSpeed: "1000000"
                            }}
                        />
                        <Divider/>
                        <Grid columns={2} divided>
                            <Grid.Row>
                                <Grid.Column width={4}>
                                    <Image circular={"true"} src={"https://lh3.googleusercontent.com/-GUzI70UbUow/Xny3qdPIVJI/AAAAAAAAE1s/w0zgyUVYCW8ek_Y68HS_yCCULoOTTPfRQCEwYBhgLKtQDAL1OcqxzTuuKiFBs3FlahmFyGMMz3tG0YxMvqjmACq7WqqnQowPLwlLkb7J1QJkklTMNeTr5UnoC5o3Oy-R-8PQ1OaD9-7IzmzJDabrjD1bMsMN8ZoG3DTZTvzrZWTsOQdgD7Tb9pMGU-4FJ3a1s78ocnWwTTWTeNO_kJqhTdc-TR7NF9A8paAdAIpBOEAqK-8xkAMkDNzp5JWikoZfFMlKJNC5tzDEyrNsQac0xOsPZ1m0Gq3yI9jhVtCTMZqmn0j_bvsgTDUA2QYmFcjJL52G98ubxbfHT4IdDaOA3hiGyEAV5QKi-jcC0ByqbJvWLbN8ELKL6N5RuYwS36m9wMeN7OCpkQ3Xp3YwBWnhy2ECRov5WvHJBDsp70mEBO-U_-R-DVx2DEHpbjvv72aP62zdffYDAJFi3rRnMYAe-y8MZovxM1iTBSsuGIT4613a9K8Naz_5IT2ZcNAzfZ-5KIMLLxH2obi6E24x12dGpuwTBLdqxkfvpyBTmFkzwA5T91LIiot8SX2-T1ZdYIZueBMZRcn5YDmTO7HpdYtWrGjqHoyLk-XrTr_c3GOpkiBbp3LPuZtFWwyCJ4MpUdDX9b4PgILYqi7mgwVTQ5KKQxbIw2HBCMM_R4_oF/w139-h140-p/Untitled.jpg"}/>
                                </Grid.Column>
                                <Grid.Column>
                                 <p>   I'm an aspiring programmer with project experience in academia, who is eager to take on any
                                     task at hand.</p>
                                </Grid.Column>

                            </Grid.Row>
                        </Grid>
                    </Container>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Container>
                        <Popular/>
                        <br/>
                        <Popular/> {/*make it the latest section */}
                    </Container>
                </Grid.Column>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
            </Grid>
        </div>
    )
}


const styles = {
    container: {
        paddingTop: "5vh",
        paddingBottom: "5vh",
        paddingRight: "5vw",
        paddingLeft: "5vw"
    }
}

export default AboutMe;

