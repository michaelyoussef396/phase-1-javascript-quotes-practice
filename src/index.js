document.addEventListener("DOMContentLoaded", () => {
  const quoteList = document.getElementById("quote-list");
  const newQuoteForm = document.getElementById("new-quote-form");

  function fetchQuotes() {
    fetch("http://localhost:3000/quotes?_embed=likes")
      .then((response) => response.json())
      .then((quotes) => {
        quoteList.innerHTML = "";
        quotes.forEach((quote) => renderQuote(quote));
      });
  }

  function renderQuote(quote) {
    const li = document.createElement("li");
    li.className = "quote-card";
    li.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        `;
    const likeButton = li.querySelector(".btn-success");
    likeButton.addEventListener("click", () => likeQuote(quote.id, li));

    const deleteButton = li.querySelector(".btn-danger");
    deleteButton.addEventListener("click", () => deleteQuote(quote.id, li));

    quoteList.appendChild(li);
  }

  newQuoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const quoteInput = event.target.quote.value;
    const authorInput = event.target.author.value;

    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quote: quoteInput,
        author: authorInput,
      }),
    })
      .then((response) => response.json())
      .then((newQuote) => {
        newQuote.likes = [];
        renderQuote(newQuote);
        event.target.reset();
      });
  });

  // Like a quote
  function likeQuote(quoteId, quoteElement) {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteId: quoteId,
        createdAt: currentTime,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        const likesSpan = quoteElement.querySelector("span");
        likesSpan.textContent = parseInt(likesSpan.textContent) + 1;
      });
  }

  function deleteQuote(quoteId, quoteElement) {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "DELETE",
    }).then(() => {
      quoteElement.remove();
    });
  }

  fetchQuotes();
});
