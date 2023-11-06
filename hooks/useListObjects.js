import {useEffect, useState} from "react";

const useListObjects = () => {
    // Get from /uploads
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadObjects = () => {
        fetch("/api/upload")
            .then((response) => response.json())
            .then((data) => {
                setObjects(data.results.blobs);
                console.log(data)
                setLoading(false);
            }).catch((error) => {
            setError(true);
        });
    }

    useEffect(() => {
        loadObjects();
    }, []);

    const reload = () => {
        loadObjects();
    }

    return {objects, loading, error, reload};
}

export default useListObjects;