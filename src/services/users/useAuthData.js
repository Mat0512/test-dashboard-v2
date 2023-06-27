import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { get, ref } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";

export const useAuthData = () => {
    const [user] = useAuthState(auth); // contains admin data

    const [authData, setAuthData] = useState(null);

    useEffect(() => {
        if (user) {
            const adminRef = ref(db, "admin");
            get(adminRef)
                .then((snapshot) => {
                    const foundAdmin = snapshot.val().filter((admin) => {
                        return admin?.email && admin.email === user.email;
                    });

                    const { fname, lname, email } = foundAdmin[0];
                    setAuthData({
                        fullName: `${fname} ${lname}`,
                        firstname: fname,
                        lastname: lname,
                        email: email,
                    });
                })
                .catch((err) => {
                    console.log("err: ", err);
                });
        }
    }, [user]);
    return authData;
};
