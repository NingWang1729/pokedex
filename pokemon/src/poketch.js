import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from "react-router-dom";
import useInfiniteScroll from './useInfiniteHook'
import LoginContext from './context';
import axios from 'axios';

function Poketch () {
    // Better than react hooks imo
    const context = React.useContext(LoginContext);
    var [favorites, setfavorites] = useState(null);
    var [userid, setuserid] = useState(context.credentials.userid);
    var [pokemon, setpokemon] = useState([]);
    var [loading, setloading] = useInfiniteScroll(loadpokemon);
    var [page, setpage] = useState(0);
    var [searchbarvalue, setsearchbarvalue] = useState("");
    let history = useHistory();

    function loadpokemon() {
        setTimeout(() => {
            getpokes();
            if (page < 30) {
                setloading(false);
            }
        }, 500);
    }

    async function getpokes() {
        if (page >= 30) {
            return;
        }
        var new_pokes = []
        for (let i = page * 30 + 1; i < page * 30 + 31; i++) {
            if (i == 899) {
                alert("Out of usable pokemon! Let's wait for Sinnoh remakes!")
                console.log("Out of usable pokemon! Let's wait for Sinnoh remakes!")
                break;
            }
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

    // Component did mount
    useEffect(() => {
        getpokes();
        fetch(`http://127.0.0.1:8000/api/user_favorites/?username=${context.credentials.username}`, {
            method : 'GET',
            headers : { 'Content-Type' : 'application/json' },
        })
        .then(
            (res) => {
                if (context.credentials.username == "") {
                    throw new Error("Must be logged in to use!")
                } else if (res.ok) {
                    // alert("Displaying Pokemon!");
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
                // console.log(data);
                if (data.length > 0) {
                    setfavorites(data[data.length - 1].favorites);
                    setuserid(data[data.length - 1].user);
                } else {
                    console.log("No favorites yet!")
                }
            }
        ).catch(
            (error) => {
                // alert(error);
                console.log(error);
                history.push('/login');
            }
        );
    }, [])

    // Update display of favorites
    useEffect(()=>{update_display(); console.log("updating fav display")});

    // Component did update [favorites]
    useEffect(() => {
        console.log("favorites changed to", favorites);
        console.log({ "favorites": favorites, "user" : userid.toString() });
        axios.post(`http://127.0.0.1:8000/api/user_favorites/`, { "favorites": favorites, "user" : userid.toString() }, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : { "favorites": favorites, "user" : userid.toString() }
        })
        .then(
            (res) => {
                if (res.ok) {
                    console.log("Updated favorite Pokemon!");
                } else {
                    console.log(res);
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            }
        )
        .then(
            (data) => {
                // console.log(data);
            }
        ).catch(
            (error) => {
                // console.log(error);
            }
        );
        // Update favorite button display
        update_display();
    }, [favorites])

    function update_display() {
        let favs;
        if (favorites == null) {
            favs = new Set([]);
        } else {
            favs = new Set(favorites.split(','));
        }
        let poketable = document.getElementsByClassName("fav-button");
        for (let i = 0; i < poketable.length; i++) {
            if (favs.has((poketable.item(i).id).toString())) {
                poketable.item(i).style.background = "chartreuse";
                poketable.item(i).style.color = "blue";
            } else {
                poketable.item(i).style.background = "crimson";
                poketable.item(i).style.color = "azure";
            }
        }
        return;
    }

    // Updates favorites
    function update_favorites (pokemon_id) {
        console.log("updating...", pokemon_id);
        let favs;
        if (favorites == null) {
            favs = new Set([]);
        } else {
            favs = new Set(favorites.split(','));
        }
        console.log("Favorites are now", favs)
        if (favs.has(pokemon_id.toString())) {
            favs.delete(pokemon_id.toString());
        } else {
            favs.add(pokemon_id);
        }
        setfavorites([...favs].sort().join());
    }

    // Display favorites (debugging)
    function display_favorites() {
        if (favorites == null) {
            return <p>No favorites!</p>
        } else {
            return favorites.split(',').map((pokemon_id) => {
                return <Fragment>
                    <div className="pokeball">
                        <p>{pokemon_id}</p>
                    </div>
                </Fragment>
            })
        }
    }

    // Display pokemon table
    function display_pokes(e) {
        try {
            if (pokemon.length <= 0) {
                return <tr><td>Loading....</td></tr>
            } else {
                let pokearray = [];
                let filtered_pokes;
                let i = 0;
                if (searchbarvalue == "") {
                    console.log("EMPTY SEARCH BAR");
                    filtered_pokes = pokemon;
                } else {
                    console.log(searchbarvalue);
                    filtered_pokes = pokemon.filter(poke => poke.species.name.indexOf(searchbarvalue) != -1)
                    if (filtered_pokes.length <= 0) {
                        getpokes();
                        return;
                    }
                }

                // Convert to a 2-D array
                for (; i < filtered_pokes.length - 2; i+=3) {
                    pokearray.push([filtered_pokes[i], filtered_pokes[i+1], filtered_pokes[i+2]])
                }
                let rest = [];
                while (i < filtered_pokes.length) {
                    rest.push(filtered_pokes[i++]);
                };
                if (rest.length > 0) {
                    pokearray.push(rest);
                }

                // Return html elements
                return pokearray.map((pokerow)=>{
                    return <tr>
                        {pokerow.map((pokentry)=>{
                            return <td key={pokentry.id} id={pokentry.id}>
                                    <p>{pokentry.species.name}</p>
                                    <img src={pokentry.sprites.front_default} alt={pokentry.species.name + "picture"}/>
                                    <br />
                                    <button id={pokentry.id} className="fav-button" onClick={() => {update_favorites(pokentry.id);}}>Fav#{pokentry.id}</button>
                                </td>
                        })}
                    </tr>
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <Fragment>
            <h1>Poketch</h1>
            <input type="text" value={searchbarvalue} placeholder="Pokesearch.." id="pokesearchbar" onChange={e => setsearchbarvalue(e.target.value)}></input>
            {/* <button onClick={update_display}>update fav display colors</button> */}
            {/* {display_favorites()} */}
            <h1>{pokemon.length}</h1>
            <table className="pokemon-table">
                <tbody>
                    {display_pokes()}
                </tbody>
            </table>
            <button onClick={getpokes}>Loading slowly? Force a manual load!</button>
        </Fragment>
    );
}

// Default export
export default Poketch;