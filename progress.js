import { db, auth, doc, getDoc } from './auth.js';

export async function loadUserProgress() {
    const user = auth.currentUser;
    if (!user) return;
    const snap = await getDoc(doc(db, 'prepData', user.uid));
    const data = snap.data();
    if (!data) return;
    // Update IELTS stats if present
    if (data.ielts) {
        const el = document.getElementById('statBand');
        if (el) el.textContent = data.ielts.targetBand || '7.5';
        const mocks = document.getElementById('statMocks');
        if (mocks) mocks.textContent = `${data.ielts.mockTestsDone || 0}/${data.ielts.totalMockTests || 3}`;
        const dur = document.getElementById('statDuration');
        if (dur) dur.textContent = data.ielts.testDuration || '2h 45m';
        const type = document.getElementById('statType');
        if (type) type.textContent = data.ielts.testType || 'Academic';
    }
    // SAT and Olympiad can be added similarly if their UI elements exist.
}

export async function aiProgressCheck() {
    const user = auth.currentUser;
    if (!user) return;
    if (!window._aiApiKey) return;
    try {
        const resp = await fetch('https://api.example.com/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window._aiApiKey}` },
            body: JSON.stringify({ uid: user.uid })
        });
        const result = await resp.json();
        const badge = document.getElementById('ctaDesc');
        if (badge && result.weakestSkill && result.percent !== undefined) {
            badge.textContent = `Your ${result.weakestSkill} skill is at ${result.percent}%. AI recommends targeted practice.`;
        }
    } catch (e) {
        console.error('AI progress check failed', e);
    }
}
