let allProducts = []; // Store all products globally
        let currentCategory = null; // Track the currently selected category

        // Function to fetch product data from the Fake Store API
        async function fetchProducts() {
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'flex'; // Show the spinner

            try {
                const response = await fetch("https://fakestoreapi.com/products");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                allProducts = await response.json(); // Get the JSON response and store it
                renderProducts(allProducts); // Pass the data to render function
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                spinner.style.display = 'none'; // Hide the spinner
            }
        }

        // Function to render products
        function renderProducts(products) {
            const productContainer = document.getElementById('productContainer');
            productContainer.innerHTML = ''; // Clear existing content

            products.forEach(product => {
                const cardHTML = `
                    <div class="col-12 col-md-4 col-lg-3">
                        <div class="card product-card">
                            <img src="${product.image}" class="card-img-top" alt="Product Image">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">$${product.price.toFixed(2)}</p>
                                <div class="rating ">
                                    ${getStars(product.rating.rate)} 
                                </div>
                                <button class="btn btn-primary mt-1">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += cardHTML; // Append the card to the container
            });
        }

        // Function to filter products by category
        function filterProductsByCategory(category) {
            currentCategory = category; // Update the current category
            const filteredProducts = allProducts.filter(product => product.category === category);
            renderProducts(filteredProducts); // Render the filtered products
        }

        // Function to sort products
        function sortProducts(criteria) {
            let sortedProducts;
            const filteredProducts = currentCategory ? allProducts.filter(product => product.category === currentCategory) : allProducts;

            switch (criteria) {
                case 'low-to-high':
                    sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
                    break;
                case 'high-to-low':
                    sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
                    break;
                case 'ratings':
                    sortedProducts = [...filteredProducts].sort((a, b) => b.rating.rate - a.rating.rate);
                    break;
                default:
                    sortedProducts = filteredProducts;
            }
            renderProducts(sortedProducts); // Render the sorted products
        }

        // Add event listeners to dropdown items for categories
        document.querySelectorAll('.dropdown-item[data-category]').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                const category = event.target.getAttribute('data-category');
                filterProductsByCategory(category); // Filter products based on selected category
            });
        });

        // Add event listeners to dropdown items for sorting
        document.querySelectorAll('.dropdown-item[data-sort]').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                const sortCriteria = event.target.getAttribute('data-sort');
                sortProducts(sortCriteria); // Sort products based on selected criteria
            });
        });

        // Function to generate star rating
        function getStars(rate) {
            const fullStars = Math.floor(rate);
            const halfStar = rate % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : '';
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            return '<i class="fas fa-star"></i>'.repeat(fullStars) + halfStar + '<i class="fas fa-star text-secondary"></i>'.repeat(emptyStars);
        }

        
        // Initial fetch of products
        fetchProducts();