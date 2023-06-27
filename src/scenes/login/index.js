import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { db, logInAuth, logOutAuth } from "../../config/firebase";
import { ref, get } from "firebase/database";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

const Login = () => {
    // const user = useCheckUser();
    const navigate = useNavigate();
    const [pass, setPass] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");
    const [invalidUsername, setInvalidEmail] = useState(false);
    const [invalidPass, setInvalidPass] = useState(false);

    const handlePass = (e) => {
        setPass(e.target.value);
    };

    const [email, setEmail] = useState("");
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        setErr("");
        setInvalidEmail(false);
        setInvalidPass(false);
        e.preventDefault();
        if (!email || !pass) {
            setInvalidEmail(!email ? true : false);
            setInvalidPass(!pass ? true : false);
            setErr("Incomplete Inputs.");
            return;
        }

        //authenticating

        logInAuth(email, pass)
            .then((userCreds) => {
                navigate("/");
            })
            .catch((e) => {
                console.log("error: ", e);
                const errMessage = e.code.includes("user-not-found")
                    ? "User does not exist"
                    : e.code.includes("wrong-password")
                    ? "Wrong Credentials"
                    : e.code.includes("too-many-requests")
                    ? "Login Error: To many attempts"
                    : "Login Error";

                setErr(errMessage);
            });
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100vh"
            backgroundColor="#fcfcfc"
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap={2}
            >
                <Typography variant="h4" color="#404040">
                    Log In
                </Typography>

                <form>
                    <Box
                        display="flex"
                        flexDirection="column"
                        width="300px"
                        gap={2}
                    >
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={handleEmail}
                        />
                        <TextField
                            fullWidth
                            autoComplete="new-password"
                            type="password"
                            error={invalidPass}
                            label="Password"
                            variant="outlined"
                            value={pass}
                            onChange={handlePass}
                        />
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{ padding: "10px" }}
                            disabled={!email || !pass}
                        >
                            Submit
                        </Button>
                        {err && (
                            <Typography
                                color="red"
                                textAlign="center"
                                fontSize="14px"
                            >
                                {err}
                            </Typography>
                        )}
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default Login;
