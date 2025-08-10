let guestList = [];
let lastPlayedIndex = -1;

const musicPlaylist = [
    'instrumentals/1.mp3', 'instrumentals/2.mp3', 'instrumentals/3.mp3',
    'instrumentals/4.mp3', 'instrumentals/5.mp3', 'instrumentals/6.mp3'
];

const songLyrics = {
    myOnlyOne: `
        <p><strong>(Verse 1)</strong><br>
        You're the one, the only one for me.<br>
        You're my love, my one and only.<br>
        Your qualities, your faith—<br>
        They bring me such a delight.<br>
        And with God's help, I know our future's bright.<br>
        It fills my heart with love to know you stand by me.<br>
        I feel your deep respect; I know you're proud of me.</p>
        <p><strong>(Chorus)</strong><br>
        Together we can be strong;<br>
        Together's where we belong.<br>
        Jehovah helps us stay more in love each day—<br>
        My only one.</p>
        <p><strong>(Verse 2)</strong><br>
        You're the one for me; you listen to my thoughts.<br>
        And as a team, we work hard for our God.<br>
        Yes, in my heart I feel you cherish me, my love.<br>
        You'll always be the one—the one I'm so proud of.</p>
        <p><strong>(Chorus)</strong><br>
        Together we can be strong;<br>
        Together's where we belong.<br>
        Jehovah helps us stay more in love each day—<br>
        My only one.<br>
        My only one,<br>
        My love.</p>
    `,
    trulyInLove: `
        <p><strong>(Verse 1)</strong><br>
        There is a gift that comes from above,<br>
        A lovely gift called being in love.<br>
        When two hearts begin to beat as one,<br>
        Then a wonderful time has begun.</p>
        <p><strong>(Chorus)</strong><br>
        It's simple, so easy.<br>
        And it's something we know.<br>
        With a threefold cord, love will grow.<br>
        With Jehovah to guide us in all that we do,<br>
        How I love to be truly in love with someone like you.</p>
        <p><strong>(Verse 2)</strong><br>
        Trials will come our way,<br>
        But our love will grow stronger each day.<br>
        We will build a bond that no one can break.<br>
        We will build a love that no one will take.<br>
        No, no, no one, no.</p>
        <p><strong>(Chorus)</strong><br>
        It's simple, so easy.<br>
        And it's something we know.<br>
        With a threefold cord, love will grow.<br>
        With Jehovah to guide us in all that we do,<br>
        How I love to be truly in love with someone like you.</p>
    `
};

window.addEventListener('DOMContentLoaded', async () => {
    await loadGuestList();
    initializeCountdown();
    setupTimeConversion();
    setupMusicPlayer();
});

async function loadGuestList() {
    try {
        const response = await fetch('Invited People.xlsx');
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        guestList = jsonData.map(row => ({
            fullName: row['Full Name'] ? row['Full Name'].toLowerCase().trim() : '',
            phoneNumber: row['Phone Number'] ? row['Phone Number'].toString().trim() : '',
            bothEvents: row['Both Events'] ? row['Both Events'].toLowerCase().trim() === 'yes' : false
        })).filter(guest => guest.fullName);
    } catch (error) {
        console.error('Error loading guest list:', error);
    }
}

function checkInvitation() {
    const input = document.getElementById('loginInput').value.toLowerCase().trim();
    if (!input) {
        showError('Please enter your full name or phone number.');
        return;
    }

    const cleanInput = input.replace(/\D/g, '');
    
    const guest = guestList.find(g => {
        if (g.fullName === input) {
            return true;
        }
        if (cleanInput && g.phoneNumber) {
            const cleanGuestPhone = g.phoneNumber.replace(/\D/g, '');
            return cleanGuestPhone === cleanInput || g.phoneNumber === input;
        }
        return false;
    });

    if (guest) {
        document.getElementById('loginModal').style.display = 'none';
        
        const guestName = guest.fullName.replace(/\b\w/g, l => l.toUpperCase());
        const greetingElement = document.getElementById('personalizedGreeting');
        let invitationMessage = guest.bothEvents 
            ? `You are warmly invited to both our Traditional and White Wedding ceremonies.`
            : `You are warmly invited to our White Wedding ceremony.`;
        
        greetingElement.innerHTML = `<h3>Hello ${guestName},</h3><p>${invitationMessage}</p>`;
        greetingElement.style.display = 'block';

        if (guest.bothEvents) {
            document.getElementById('traditionalWedding').style.display = 'flex';
        } else {
            document.getElementById('traditionalWedding').style.display = 'none';
        }
        
        document.getElementById('mainContent').style.display = 'block';
        playBackgroundMusic();
    } else {
        showError(`We couldn't find your invitation. This event is strictly by invitation only. Please contact Derrick or Maame if you believe this is a mistake.`);
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

document.getElementById('loginInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkInvitation();
    }
});

function initializeCountdown() {
    const weddingDate = new Date('September 27, 2025 14:00:00 GMT');
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const now = new Date();
        const timeDiff = weddingDate - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
        } else if (countdownElement) {
            countdownElement.innerHTML = '<h3>The Wedding Day is Here!</h3>';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function setupTimeConversion() {
    const timeDisplays = document.querySelectorAll('.time-display');
    timeDisplays.forEach(display => {
        const gmtTime = display.getAttribute('data-gmt');
        const parentEventCard = display.closest('.event-card');
        const localTimeElement = parentEventCard.querySelector('.local-time');
        
        const dateString = parentEventCard.querySelector('.event-date').textContent.trim().replace(/,/g, '');
        const dateParts = dateString.split(' ');
        const eventDate = `${dateParts[2]} ${dateParts[1]}, ${dateParts[3]}`;

        if (localTimeElement) {
            const [time, period] = gmtTime.split(' ');
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            
            const weddingDateTime = new Date(`${eventDate} ${hour.toString().padStart(2, '0')}:${minutes}:00 GMT`);
            
            const localTime = weddingDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' });
            localTimeElement.textContent = `(${localTime} in your timezone)`;
        }
    });
}

function setupMusicPlayer() {
    const audio = document.getElementById('backgroundMusic');
    audio.removeEventListener('ended', handleMusicEnded);
    audio.addEventListener('ended', handleMusicEnded);
    audio.addEventListener('error', () => {
        playBackgroundMusic();
    });
}

function handleMusicEnded() {
    setTimeout(() => {
        playBackgroundMusic();
    }, 100);
}

function playBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    
    if (musicPlaylist.length === 1) {
        audio.src = musicPlaylist[0];
        lastPlayedIndex = 0;
    } else {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * musicPlaylist.length);
        } while (randomIndex === lastPlayedIndex);
        
        lastPlayedIndex = randomIndex;
        audio.src = musicPlaylist[randomIndex];
    }
    
    audio.volume = 0.3;
    
    setTimeout(() => {
        audio.play().catch(error => {
            if (musicPlaylist.length > 1) {
                playBackgroundMusic();
            }
        });
    }, 50);
}

function pauseBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    audio.pause();
}

function playVideo(videoId) {
    pauseBackgroundMusic();
    
    document.querySelectorAll('.video-container').forEach(container => {
        container.style.display = 'none';
        container.querySelector('video').pause();
    });

    const container = document.getElementById(videoId);
    const lyricsContainer = container.querySelector('.lyrics-container');
    
    lyricsContainer.innerHTML = songLyrics[videoId] || '';
    container.style.display = 'flex';
    container.querySelector('video').play();
}

function closeVideo(videoId) {
    const container = document.getElementById(videoId);
    container.style.display = 'none';
    const videoPlayer = container.querySelector('video');
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    playBackgroundMusic();
}