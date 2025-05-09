import "./output.css";

const GOOGLE_API_BASE = "https://www.googleapis.com/books/v1/volumes?q=";

const searchForm = document.getElementById("search-form") as HTMLFormElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchType = document.getElementById("search-type") as HTMLSelectElement;
const searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
const bookContainer = document.getElementById("book-result") as HTMLDivElement;

const displayBookResults = (books: any[]) => {
    bookContainer.innerHTML = "";

    if (!books || books.length === 0) {
        bookContainer.innerHTML = `<p>No book found!</p>`;
    }

    bookContainer.innerHTML = books.map((bookDetails) => {
        const { volumeInfo } = bookDetails
        const {
            title,
            authors,
            description,
            imageLinks,
            previewLink
        } = volumeInfo;

        return `
            <img src="${imageLinks?.thumbnail ?? "default.jpg"}">
            <p><b>Tittle: </b>${title ?? "N/A"}</p>
            <p><b>Author: </b>${authors.join(", ") ?? "N/A"}</p>
            <a href="${previewLink}" target="_blank">Preview</a>
            <p><b>Description: </b>${description ?? "No description"}</p>
        `
    }).join(" ");
}

const searchBookTitle = async () => {
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
            bookContainer.innerHTML = `<p>Cannot fetch book!</p>`;
        }
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBookTitle();
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchBookTitle();
    }
});

searchBtn.addEventListener("click", searchBookTitle);