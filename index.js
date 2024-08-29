const pusblishBtn = document.getElementById('publish-btn');
const endorsementText = document.getElementById('endorsement-text');


import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

const appSettings = {
    databaseURL: "https://champions-d4fc8-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const referenceInDB = ref(database, 'endorsements')

const endorsementSection = document.getElementById('endorsements-section');

onValue(referenceInDB, function (snapshot) {
    endorsementSection.innerHTML = ''
    if (snapshot.exists()) {
        const endorsementsInDB = Object.values(snapshot.val());

        let allEndorsements = ''
        for (let i = 0; i < endorsementsInDB.length; i++) {
            let endorsement = document.createElement('div');
            endorsement.classList.add('endorsement-div')
            endorsement.innerHTML = endorsementsInDB[i];
            endorsementSection.append(endorsement)
        }

    } else {
        endorsementSection.innerHTML = "No endorsements yet..."
    }
})

pusblishBtn.addEventListener('click', function () {
    push(referenceInDB, endorsementText.value)
    endorsementText.value = ''
})
