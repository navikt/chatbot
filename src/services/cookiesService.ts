import Cookies from 'js-cookie';

const saveJSON = (key: string, data: any | any[]): void => {
    Cookies.set(key, data,
      { domain: document.location.hostname !== 'localhost' ? '.nav.no' : undefined });
};

const loadJSON = (key: string): any | any[] | null => {
    return Cookies.getJSON(key) || null;
};

const deleteJSON = (key: string): void => {
    Cookies.remove(key);
};

export { saveJSON, loadJSON, deleteJSON };
