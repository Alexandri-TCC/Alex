import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBycErHNpN7qb1I6eEXvi_OUr2gW5cPyNc",
    authDomain: "alexandriatcc-8b4b9.firebaseapp.com",
    projectId: "alexandriatcc-8b4b9",
    storageBucket: "alexandriatcc-8b4b9.firebasestorage.app",
    messagingSenderId: "562578008215",
    appId: "1:562578008215:web:858e0cfc58f406b97721d2",
    measurementId: "G-MQTENS8N2K"
};

const app = initializeApp(firebaseConfig);
const banco = getFirestore(app);
const verificador = getAuth(app);

export {banco, verificador};