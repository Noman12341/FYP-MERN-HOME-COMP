import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...rest }) {
    const [isLogged, setIslogged] = useState(true);

    useEffect(() => {
        async function Auth() {
            let jwtToken = localStorage.getItem('token');
            if (jwtToken) {
                await Axios.get("/api/auth/checkauth", { headers: { 'x-auth-token': jwtToken } })
                    .then(res => {
                        if (res.status === 200) {
                            setIslogged(true)
                        }
                    }).catch(error => {
                        if (error.response.status === 400) {
                            setIslogged(false);
                        }
                    });
            } else { setIslogged(false); }
        }
        Auth();
    }, []);
    return <Route {...rest} render={(props) => {
        if (isLogged === true) {
            return <Component {...props} />;
        } else {
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {
                            from: props.location
                        }
                    }}
                />
            );
        }
    }}
    />
}

export default ProtectedRoute;