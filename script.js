document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://sandramca2024.github.io/Event-json-file/events.json';

    let eventsData = [];
    let filteredData = [];
    let currentPage = 1;
    const eventsPerPage = 3;

    const fetchButton = document.getElementById('fetchData');
    const searchInput = document.getElementById('searchBar');
    const sortSelect = document.getElementById('sortOptions');
    const eventGrid = document.getElementById('eventGrid');
    const pagination = document.getElementById('pagination');

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            eventsData = data.events;
            filteredData = eventsData;
            displayEvents();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayEvents() {
        eventGrid.innerHTML = '';

        const startIndex = (currentPage - 1) * eventsPerPage;
        const endIndex = startIndex + eventsPerPage;
        const eventsToDisplay = filteredData.slice(startIndex, endIndex);

        eventsToDisplay.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.innerHTML = `
                <img src="${event.logo.url}" alt="${event.name}">
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <p>Price: $${event.amount}</p>
            `;
            eventGrid.appendChild(eventElement);
        });

        updatePagination();
    }

    function updatePagination() {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(filteredData.length / eventsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-button');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayEvents();
            });
            pagination.appendChild(pageButton);
        }
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredData = eventsData.filter(event =>
            event.name.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayEvents();
    });

    sortSelect.addEventListener('change', () => {
        const sortOption = sortSelect.value;

        switch (sortOption) {
            case 'name':
                filteredData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'priceHigh':
                filteredData.sort((a, b) => b.amount - a.amount);
                break;
            case 'priceLow':
                filteredData.sort((a, b) => a.amount - b.amount);
                break;
        }

        displayEvents();
    });

    fetchButton.addEventListener('click', fetchData);
});
