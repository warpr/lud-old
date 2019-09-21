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
    }, []);

    return [data, loading];
}

function BrowseLibrary(props) {
    const [data, loading] = useFetch(
        'https://lûd.com/file-system.php/music/artists/squarepusher/1999.selection-sixteen',
    );

    return e(
        React.Fragment,
        {},
        e('h1', { style: { color: 'red' } }, 'Hello from React'),
        e('pre', {}, loading ? 'Loading...' : JSON.stringify(data, null, 4)),
    );
}

customElements.define(
    'lud-browse-library',
    class extends HTMLElement {
        connectedCallback() {
            const mountPoint = document.createElement('span');
            this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

            ReactDOM.render(e(BrowseLibrary), mountPoint);
        }
    },
);
