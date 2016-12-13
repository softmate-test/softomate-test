require('./index.less');
import messageTemplate from './message.handlebars';
import icon from './icon.handlebars';

const domainCompare = domain => domain === location.host || `www.${domain}` === location.host;

const showMessage = (name, message) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = messageTemplate({message});
    wrapper.children[0].onclick = () => {
        document.body.removeChild(document.getElementById('softomate-test-message'));
        chrome.runtime.sendMessage({type: 'closeMessage', data: name});
    };
    document.body.appendChild(wrapper.children[0]);
    chrome.runtime.sendMessage({type: 'showMessage', data: name});
};

let list;

const markerGoogle = list => {
    const searchResults = Array.prototype.slice.call(document.getElementsByClassName('rc'));
    const iconAlreadyExist = node => node.innerHTML.indexOf('softomate-test-message-icon') !== -1;
    const checkExistUrl = (node, domain) => {
        const options = [
            `data-href="https://${domain}`,
            `data-href="http://${domain}`,
            `data-href="https://www.${domain}`,
            `data-href="http://www.${domain}`,
            `href="https://${domain}`,
            `href="http://${domain}`,
            `href="https://www.${domain}`,
            `href="http://www.${domain}`
        ];
        return options.some(option => node.innerHTML.indexOf(option) !== -1);
    };
    searchResults.forEach(node => {
        list.forEach(({domain}) => {
            if (checkExistUrl(node, domain) && !iconAlreadyExist(node)) {
                node.innerHTML = icon() + node.innerHTML;
            }
        })
    });
    setTimeout(markerGoogle, 100, list);
};

const markerBing = list => {
    const searchResults = Array.prototype.slice.call(document.getElementsByClassName('b_algo'));
    const iconAlreadyExist = node => node.innerHTML.indexOf('softomate-test-message-icon') !== -1;
    const checkExistUrl = (node, domain) => {
        const options = [
            `href="https://${domain}`,
            `href="http://${domain}`,
            `href="https://www.${domain}`,
            `href="http://www.${domain}`
        ];
        return options.some(option => node.innerHTML.indexOf(option) !== -1);
    };
    searchResults.forEach(node => {
        list.forEach(({domain}) => {
            if (checkExistUrl(node, domain) && !iconAlreadyExist(node)) {
                node.innerHTML = icon() + node.innerHTML;
            }
        })
    });
    setTimeout(markerGoogle, 100, list);
};

chrome.runtime.sendMessage({type: 'list'}, list => {
    if (list) {
        list.forEach(({name, domain, message}) => {
            if (domainCompare(domain)) {
                chrome.runtime.sendMessage({type: 'checkShowMessage', data: name}, ({res}) => {
                    if (res) {
                        showMessage(name, message);
                    }
                })
            }
        });
        switch (location.host) {
            case 'google.com':
            case 'google.ru':
            case 'www.google.com':
            case 'www.google.ru':
                markerGoogle(list);
                break;
            case 'www.bing.com':
            case 'bing.com':
                markerBing(list);
                break;
        }
    }
});
