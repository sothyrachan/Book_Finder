import "./output.css";

const GOOGLE_API_BASE = "https://www.googleapis.com/books/v1/volumes?q=";

const searchForm = document.getElementById("search-form") as HTMLFormElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchType = document.getElementById("search-type") as HTMLSelectElement;
const searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
const bookContainer = document.getElementById("book-result") as HTMLDivElement;

// type BookType = {
//     title: string;
//     authors: string;
//     description: string;
//     imageLinks: string;
// }

const displayBookResults = (books: any[]): void => {
    if (!books || books.length === 0) {
        bookContainer.textContent = "";
    } 
}

const searchBookTittle = async() => {
    const searchInputValue = searchInput.value.trim().toLowerCase();
    const typeOfSearch = searchType.value;

    if (!searchInputValue) {
        console.error("Please enter the book title!");
        return;
    }

    try {
        const res = await fetch(`${GOOGLE_API_BASE}${typeOfSearch}:${searchInputValue}`);
        if (!res.ok) throw new Error("Cannot fetch the book!")

        const data = await res.json();
        if ("message" in data) throw new Error(data.message);

        displayBookResults(data.items);
    } catch (err) {
        console.log("Error: ", err)
        if (bookContainer) {
            bookContainer.textContent = `<p>No book found!</p>`;
        }
    }
}