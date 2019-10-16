const saveJSON = (key: string, data: any | any[]): void => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const loadJSON = (key: string): any | any[] | null => {
    return JSON.parse(sessionStorage.getItem(key) as string);
};

const deleteJSON = (key: string): void => {
    sessionStorage.removeItem(key);
};

export { saveJSON, loadJSON, deleteJSON };
