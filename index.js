const publishBtn = document.getElementById('publish-btn');
const endorsementText = document.getElementById('endorsement-text');
const sender = document.getElementById('sender');
const receiver = document.getElementById('receiver');
import { getDatabase, ref, push, onValue, update } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

const appSettings = {
    databaseURL: "https://champions-d4fc8-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const referenceInDB = ref(database, 'endorsements')

const endorsementSection = document.getElementById('endorsements-section');


onValue(referenceInDB, function (snapshot) {
    console.log(snapshot.exists(), 'snapshot.exists()')
    endorsementSection.innerHTML = '';

    if (snapshot.exists()) {

        const endorsementsInDB = Object.entries(snapshot.val());

        for (let i = 0; i < endorsementsInDB.length; i++) {

            let [key, endorsementObj] = endorsementsInDB[i]
            let endorsement = document.createElement('div');
            endorsement.classList.add('endorsement-div')

            endorsement.innerHTML = `
            <h3 class="receiver">To ${endorsementObj.receiver}</h3>
            ${endorsementObj.text}
            <div class="container">
                <h3 class="sender">From ${endorsementObj.sender}</h3>
                <div class="likes-container">
                    <span class="${localStorage.getItem(key) ? 'filled-heart' : 'empty-heart'} likeSpan heart-icon" data-key=${key} id="heart">
                        ${localStorage.getItem(key) ? '&#x2665;' : '&#x2661;'} 
                    </span>
                    <span>${endorsementObj.likes ? endorsementObj.likes : 0}</span>
                </div>
            </div>
            `;
            endorsementSection.append(endorsement);
            
        }
        let heartIcon = document.querySelectorAll('.heart-icon');
        heartIcon.forEach(icon => {
            icon.addEventListener('click', function (event) {
                const endorsementKey = event.target.dataset.key;
                // console.log(endorsementKey, 'endorsementKey');
                console.log(event.target.nextElementSibling, 'event.target');
                let likesCountElement = event.target.nextElementSibling;

                // console.log(likesCountElement.textContent, 'likesCountElement.textContent');
                let currentLikes = parseInt(likesCountElement.textContent, 10);
                // console.log(event.target.textContent, 'event.target.textContent.split');
                console.log(currentLikes, 'currentLikes');
                let endorsementRef = ref(database, `endorsements/${endorsementKey}`);
                if (localStorage.getItem(endorsementKey)) {
                    update(endorsementRef, {
                        likes: currentLikes - 1
                    }).then(() => {
                        localStorage.removeItem(endorsementKey);
                        likesCountElement.textContent = currentLikes - 1;
                        event.target.innerHTML = '&#x2661; ${currentLikes - 1}'
                        event.target.classList.remove('filled-heart');
                        event.target.classList.add('empty-heart');
                    })


                } else {
                    update(endorsementRef, { likes: currentLikes + 1 }).then(() => {
                        localStorage.setItem(endorsementKey, true)
                        event.target.innerHTML = '&#x2665; ${currentLikes + 1} '
                        this.classList.remove('empty-heart');
                        this.classList.add('filled-heart');
                    })
                    // event.target.src = 'assets/heart-filled.png'
                    // console.log(event.target.src, 'event.target.src');
                    // console.log(event.target);

                    // event.target.style.display = 'none';
                    // setTimeout(() => {
                    //     event.target.src = 'assets/heart-filled.png';
                    //     event.target.style.display = 'block';
                    // }, 50);
                }
            })
        })
    } else {
        endorsementSection.innerHTML = "No endorsements yet..."
        endorsementSection.classList.add('endorsement-section-empty')
    }
})

publishBtn.addEventListener('click', function () {
    const endorsement = {
        text: endorsementText.value,
        sender: sender.value,
        receiver: receiver.value,
        likes: 1
    }

    console.log(endorsement, 'endorsement')
    push(referenceInDB, endorsement)
    endorsementText.value = ''
    sender.value = ''
    receiver.value = ''
})
