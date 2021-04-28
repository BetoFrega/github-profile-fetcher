import './App.css';
import useFetch from 'use-http'
import {Avatar, Container, Grid, List, ListItem, TextField, Typography} from "@material-ui/core";
import {useEffect, useMemo, useState} from "react";


export default function App() {
    const [username, setUsername] = useState('fregadev')
    const {response: profile} = useFetch(`https://api.github.com/users/${username}`, [username])
    const {response: stars} = useFetch(`https://api.github.com/users/${username}/starred`, [username])
    const [repos, setRepos] = useState<any>(null)

    useEffect(() => {
        if (username) {
            (async () => {
                const repos = await fetch(`https://api.github.com/users/${username}/repos`)
                setRepos(await repos.json())
            })()
        }
    }, [username])

    const watchers = useMemo(() => {
        return repos && repos.reduce((total: 0, repo: { watchers: number }) => total + repo.watchers, 0)
    }, [repos])
    const forks = useMemo(() => {
        return repos && repos.reduce((total: 0, repo: { forks: number }) => total + repo.forks, 0)
    }, [repos])
    let onChangeTextField = (e) => {
        setUsername(e.target.value)
    };
    return (
        <Container>
            <Grid container spacing={2} direction="column">
                <Grid item>
                    <Typography>github.com/</Typography>
                    <TextField value={username} onChange={onChangeTextField}/>
                </Grid>
                <Grid item>
                    {
                        profile.data && stars.data && <Grid container>
                            <Grid item>
                                <Avatar src={profile.data.avatar_url}/>
                            </Grid>
                            <Grid item>
                                <List><
                                    ListItem>Followers: {profile.data.followers}</ListItem>
                                    <ListItem>Public Repositories: {profile.data.public_repos}</ListItem>
                                    <ListItem>Stars: {stars.data.length}</ListItem>
                                    <ListItem>Watchers: {watchers}</ListItem>
                                    <ListItem>Forks: {forks}</ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Container>
    );
}
