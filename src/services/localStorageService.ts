const saveJSON = (key: string, data: any | any[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
};

const loadJSON = (key: string): any | any[] | null => {
    return JSON.parse(localStorage.getItem(key) as string);
};

const deleteJSON = (key: string): void => {
    localStorage.removeItem(key);
};

export { saveJSON, loadJSON, deleteJSON };
