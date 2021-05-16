import React, { useState, useEffect, Fragment } from 'react';
import ReactPaginate from 'react-paginate'
import { useHistory } from "react-router-dom";
import LoginContext from './context';
import axios from 'axios';

function Poketch () {
    // Better than react hooks imo
    const context = React.useContext(LoginContext);
    var [favorites, setfavorites] = useState(null);
    var [pokemon, setpokemon] = useState([]);
    var [loading, setloading] = useState(false);
    var [page, setpage] = useState(0);
    var [y, sety] = useState(0);
    var [pagenumber, setpagenumber] = useState(0);
    const pokesperpage = 30;
    const pagesVisited = pagenumber * pokesperpage;

    let history = useHistory();

    async function getpokes(page) {
        setloading(true);
        var new_pokes = []
        for (let i = page * 30 + 1; i < 31; i++) {
            console.log(i);
            await axios
            .get(`https://pokeapi.co/api/v2/pokemon/${i}`)
            .then(res => {
                new_pokes.push(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        }
        setpage(page + 1);
        setpokemon(pokemon.concat(new_pokes));
    }

    useEffect(() => {
        getpokes(page);
        console.log(pokemon);
        fetch(`http://127.0.0.1:8000/api/user_favorites/?username=${context.credentials.username}`, {
            method : 'GET',
            headers : { 'Content-Type' : 'application/json' },
        })
        .then(
            (res) => {
                if (res.ok) {
                    alert("Logged In!");
                    console.log("Valid credentials");
                } else {
                    console.log(res);
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            }
        )
        .then(
            (data) => {
                console.log(data);
                setfavorites(data[0]);
            }
        ).catch(
            (error) => {
                alert("INVALID USERNAME OR PASSWORD!");
                console.log(error);
                history.push('/login');
            }
        );
    }, [])

    function update (pokemon_id) {
        console.log("updating...", pokemon_id);
    }

    function display_favorites() {
        if (favorites == null) {
            return <p>No favorites!</p>
        } else {
            return favorites.favorites.split(',').map((pokemon_id) => {
                return <Fragment>
                    <div className="pokeball">
                        <p>{pokemon_id}</p>
                        <button onClick={() => {update(pokemon_id);}}>Pokemon#20</button>
                    </div>
                    <button onClick={getpokes.bind(this, 0)}></button>
                </Fragment>
            })
        }
    }

    // Display pokemon table
    function display_pokes() {
        try {
            if (pokemon.length <= 0) {
                return <tr><td>Loading....</td></tr>
            } else {
                let pokearray = [];
                let i = 0;
                for (; i < pokemon.length - 2; i+=3) {
                    pokearray.push([pokemon[i], pokemon[i+1], pokemon[i+2]])
                }
                let rest = [];
                while (i < pokemon.length) {
                    rest.push(pokemon[i++]);
                };
                if (rest.length > 0) {
                    pokearray.push(rest);
                }
                console.log(pokearray)
                return pokearray.map((pokerow, pokerowindex)=>{
                    return <tr>
                        {pokerow.map((pokentry, pokentryindex)=>{
                            return <td key={pokerowindex * 3 + pokentryindex + 1} id={pokerowindex * 3 + pokentryindex + 1}>
                                    <p>{pokentry.species.name}</p>
                                </td>
                        })}
                    </tr>
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    return (
        <Fragment>
            <p>Poketch</p>
            {display_favorites()}
            <h1>{pokemon.length}</h1>
            <table className="pokemon-table">
                <tbody>
                    {display_pokes()}
                </tbody>
            </table>
        </Fragment>
    );
}

// Default export
export default Poketch;