const updateSites = () => fetch('https://www.softomate.net/ext/employees/list.json')
    .then(res => res.json())
    .then(list => {
        localStorage.setItem('list', JSON.stringify(list));
        localStorage.setItem('lastUpdate', Date.now().toString());
    });

const ONE_HOUR = 1000 * 60 * 60;

const lastUpdate = localStorage.getItem('lastUpdate');

if (!lastUpdate || ((Date.now() - parseInt(lastUpdate)) > ONE_HOUR)) {
    updateSites();
}

const closeMessage = name => {
    const closedList = JSON.parse(localStorage.getItem('closedList')) || [];
    closedList.push(name);
    localStorage.setItem('closedList', JSON.stringify(closedList));
};

const showMessage = name => {
    const shownList = JSON.parse(sessionStorage.getItem('shownList')) || {};
    shownList[name] = (shownList.hasOwnProperty(name) ? parseInt(shownList[name]) : 0) + 1;
    sessionStorage.setItem('shownList', JSON.stringify(shownList));
};

const checkShowMessage = (name, sendResponse) => {
    const shownList = JSON.parse(sessionStorage.getItem('shownList')) || {};
    const closedList = JSON.parse(localStorage.getItem('closedList')) || [];
    if (shownList.hasOwnProperty(name) && shownList[name] >= 3) {
        sendResponse({res: false});
    }
    if (closedList.indexOf(name) !== -1) {
        sendResponse({res: false});
    }
    sendResponse({res: true});
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case 'list':
            sendResponse(JSON.parse(localStorage.getItem('list')));
            break;
        case 'checkShowMessage':
            checkShowMessage(request.data, sendResponse);
            break;
        case 'showMessage':
            showMessage(request.data);
            break;
        case 'closeMessage':
            closeMessage(request.data);
            break;
    }
});
