const e = React.createElement;

function useFetch(url) {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    async function fetchUrl() {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
    }

    React.useEffect(() => {
        fetchUrl();
    }, [url]);

    return [data, loading];
}

function playNow(release) {
    console.log('play now', release);
    document.dispatchEvent(new CustomEvent('lud.play-now', { detail: { release } }));
}

function ShowRelease(props) {
    const metadata = props.data['foaf:primaryTopic'];
    const mbid = metadata['@id'].replace('mb-release:', 'https://musicbrainz.org/release/');
    const cover = props.data['@id'] + '/cover.jpg';

    return e(
        React.Fragment,
        {},
        e(
            'h3',
            {},
            e('a', { href: mbid, target: '_blank' }, metadata['dc:title']),
            ' by ',
            metadata['schema:creditedTo'],
        ),
        e(
            'p',
            {},
            e('img', { width: '300px', src: cover }),
            e('br'),
            e('button', { onClick: () => playNow(props.data) }, 'Play now'),
        ),
    );
}

function ShowFolder(props) {
    const files = props.data['@reverse']['nfo:belongsToContainer'].map(item => {
        const path = item['nfo:fileUrl'];
        const basename = item['nfo:fileUrl'].split('/').pop();
        return e('li', {}, e('a', { href: '#', onClick: () => props.setPath(path) }, basename));
    });
    return e('ul', { className: 'lud-directory-listing' }, ...files);
}

function Loading(props) {
    return e('h1', {}, 'Loading...');
}

function Breadcrumbs(props) {
    const parts = props.data['@id'].split('/');

    if (parts[0] === '') {
        parts.shift();
    }

    const links = parts.map((item, idx) => {
        const path = '/' + parts.slice(0, idx + 1).join('/');
        return e('a', { href: '#', onClick: () => props.setPath(path) }, item);
    });

    const crumbs = [].concat(...links.map(a => [a, ' > ']));
    crumbs.pop();

    return e('span', { className: 'lud-breakcrumbs' }, ...crumbs);
}

function BrowseLibrary(props) {
    const [path, setPath] = React.useState('/music');
    const [data, loading] = useFetch('https://lûd.com/file-system.php/' + path);

    if (loading) {
        return e(Loading);
    }

    return e(
        React.Fragment,
        {},
        e(Breadcrumbs, { data, setPath }),
        data['lud:isRelease']
            ? e(ShowRelease, { data, setPath })
            : e(ShowFolder, { data, setPath }),
    );
}

customElements.define(
    'lud-browse-library',
    class extends HTMLElement {
        connectedCallback() {
            const mountPoint = document.createElement('span');
            this.appendChild(mountPoint);

            ReactDOM.render(e(BrowseLibrary), mountPoint);
        }
    },
);
