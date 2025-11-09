// hamburger menu
const hamMenu = document.querySelector(".ham-menu");

const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Create dots
    slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

    const dots = document.querySelectorAll('.dot');

    function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
         dots.forEach((dot, index) => {
             dot.classList.toggle('active', index === currentSlide);
         });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-advance carousel
    let autoSlide = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });

    carousel.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Blog Posts
    const blogPosts = [
            {
                id: 1,
                title: "Getting Started with Web Development",
                category: "Technology",
                author: "Jane Doe",
                date: "November 1, 2025",
                excerpt: "Learn the basics of HTML, CSS, and JavaScript to start your journey in web development. This comprehensive guide covers everything you need to know.",
                icon: "💻",
                content: `
                    <p>Web development is an exciting field that combines creativity with technical skills. Whether you're looking to build your own website or start a career in tech, understanding the fundamentals is essential.</p>

                    <h2>The Building Blocks</h2>
                    <p>Every website is built using three core technologies:</p>
                    <ul>
                        <li><strong>HTML (HyperText Markup Language)</strong> - The structure and content of your web pages</li>
                        <li><strong>CSS (Cascading Style Sheets)</strong> - The styling and visual presentation</li>
                        <li><strong>JavaScript</strong> - The interactivity and dynamic behavior</li>
                    </ul>

                    <h2>Getting Started with HTML</h2>
                    <p>HTML is the foundation of every web page. It uses tags to define different elements like headings, paragraphs, links, and images. Start by creating a simple HTML file and experimenting with different tags.</p>

                    <h2>Styling with CSS</h2>
                    <p>CSS brings your HTML to life with colors, layouts, fonts, and animations. Learn about selectors, properties, and values to create beautiful designs. Modern CSS features like Flexbox and Grid make layouts easier than ever.</p>

                    <h2>Adding Interactivity with JavaScript</h2>
                    <p>JavaScript makes your websites interactive. From simple button clicks to complex web applications, JavaScript is the language that powers the modern web. Start with the basics of variables, functions, and DOM manipulation.</p>

                    <h2>Next Steps</h2>
                    <p>Practice is key to becoming a great web developer. Build small projects, experiment with different techniques, and never stop learning. The web is constantly evolving, and there's always something new to discover!</p>
                `
            },
            {
                id: 2,
                title: "The Art of Minimalist Living",
                category: "Lifestyle",
                author: "John Smith",
                date: "October 28, 2025",
                excerpt: "Discover how simplifying your life can lead to greater happiness and fulfillment. Less is often more when it comes to living well.",
                icon: "🏡",
                content: `
                    <p>In a world of constant consumption and endless choices, minimalism offers a refreshing alternative. It's not about deprivation, but about intentionality and finding what truly matters.</p>

                    <h2>What is Minimalism?</h2>
                    <p>Minimalism is a lifestyle choice focused on reducing excess and focusing on what adds value to your life. It's about quality over quantity, experiences over possessions, and intentionality over impulse.</p>

                    <h2>Benefits of Minimalist Living</h2>
                    <ul>
                        <li>Reduced stress and anxiety from clutter</li>
                        <li>More time and energy for what matters</li>
                        <li>Financial freedom from reduced spending</li>
                        <li>Environmental benefits from consuming less</li>
                        <li>Greater appreciation for what you have</li>
                    </ul>

                    <h2>Starting Your Journey</h2>
                    <p>Begin by decluttering one area at a time. Ask yourself if each item serves a purpose or brings you joy. Donate, sell, or recycle items that no longer serve you. Remember, minimalism is personal - there's no one-size-fits-all approach.</p>

                    <h2>Beyond Physical Possessions</h2>
                    <p>Minimalism extends beyond stuff. Consider minimizing digital clutter, commitments, and relationships that drain your energy. Focus on what nourishes your soul and aligns with your values.</p>

                    <h3>Conclusion</h3>
                    <p>Minimalist living is a journey, not a destination. Start small, be patient with yourself, and enjoy the freedom that comes from living with less.</p>
                `
            },
            {
                id: 3,
                title: "Understanding Modern Photography",
                category: "Photography",
                author: "Emily Chen",
                date: "October 25, 2025",
                excerpt: "Master the fundamentals of photography composition, lighting, and editing to capture stunning images that tell compelling stories.",
                icon: "📸",
                content: `
                    <p>Photography is both an art and a science. With modern cameras in everyone's pocket, understanding the principles of good photography has never been more valuable.</p>

                    <h2>The Exposure Triangle</h2>
                    <p>Three elements control how your photo looks:</p>
                    <ul>
                        <li><strong>Aperture</strong> - Controls depth of field and light</li>
                        <li><strong>Shutter Speed</strong> - Captures motion and affects exposure</li>
                        <li><strong>ISO</strong> - Determines sensor sensitivity to light</li>
                    </ul>

                    <h2>Composition Rules</h2>
                    <p>Great composition guides the viewer's eye and tells a story. The rule of thirds, leading lines, and framing are classic techniques that work beautifully. But don't be afraid to break the rules once you understand them!</p>

                    <h2>The Importance of Light</h2>
                    <p>Photography is literally "writing with light." The golden hour (just after sunrise and before sunset) provides soft, warm light that flatters any subject. Learn to see and use natural light to your advantage.</p>

                    <h2>Post-Processing</h2>
                    <p>Editing is where your vision comes to life. Learn the basics of color correction, exposure adjustment, and cropping. Software like Lightroom and Photoshop are industry standards, but many free alternatives exist.</p>

                    <h2>Practice and Experimentation</h2>
                    <p>The best way to improve is to shoot regularly. Try different genres, experiment with settings, and study the work of photographers you admire. Every photo is a learning opportunity.</p>
                `
            },
            {
                id: 4,
                title: "Healthy Meal Prep Ideas",
                category: "Food",
                author: "Michael Brown",
                date: "October 22, 2025",
                excerpt: "Save time and eat healthier with these delicious meal prep recipes and strategies. Perfect for busy professionals and families.",
                icon: "🥗",
                content: `
                    <p>Meal prepping is a game-changer for anyone looking to eat healthier, save money, and reduce daily stress about meals. With a little planning, you can enjoy nutritious, home-cooked meals all week long.</p>

                    <h2>Benefits of Meal Prep</h2>
                    <ul>
                        <li>Saves time during busy weekdays</li>
                        <li>Reduces food waste and saves money</li>
                        <li>Helps with portion control and nutrition goals</li>
                        <li>Reduces the temptation for unhealthy takeout</li>
                        <li>Less stress about "what's for dinner?"</li>
                    </ul>

                    <h2>Getting Started</h2>
                    <p>Choose a prep day (usually Sunday) and dedicate 2-3 hours to cooking. Invest in quality storage containers that are microwave and dishwasher safe. Start simple with 2-3 recipes and gradually expand your rotation.</p>

                    <h2>Easy Meal Prep Ideas</h2>
                    <h3>Breakfast</h3>
                    <p>Overnight oats, egg muffins, and smoothie packs are perfect for busy mornings.</p>

                    <h3>Lunch</h3>
                    <p>Buddha bowls with grains, protein, and roasted vegetables are nutritious and versatile.</p>

                    <h3>Dinner</h3>
                    <p>Sheet pan meals, slow cooker recipes, and stir-fries are easy to batch cook and store.</p>

                    <h2>Storage Tips</h2>
                    <p>Most prepped meals last 3-4 days in the refrigerator. For longer storage, freeze individual portions. Label everything with dates and contents. Reheat thoroughly before eating.</p>
                `
            },
            {
                id: 5,
                title: "Exploring Machine Learning Basics",
                category: "Technology",
                author: "Sarah Johnson",
                date: "October 20, 2025",
                excerpt: "An introduction to machine learning concepts, algorithms, and practical applications in today's technology landscape.",
                icon: "🤖",
                content: `
                    <p>Machine learning is revolutionizing how we interact with technology. From recommendation systems to autonomous vehicles, ML algorithms are everywhere in our daily lives.</p>

                    <h2>What is Machine Learning?</h2>
                    <p>Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. Instead of following pre-defined rules, ML systems identify patterns in data.</p>

                    <h2>Types of Machine Learning</h2>
                    <ul>
                        <li><strong>Supervised Learning</strong> - Learning from labeled data</li>
                        <li><strong>Unsupervised Learning</strong> - Finding patterns in unlabeled data</li>
                        <li><strong>Reinforcement Learning</strong> - Learning through trial and error</li>
                    </ul>

                    <h2>Popular Applications</h2>
                    <p>Machine learning powers many technologies we use daily: spam filters, voice assistants, product recommendations, facial recognition, medical diagnosis, and financial fraud detection.</p>

                    <h2>Getting Started</h2>
                    <p>Start with Python and libraries like scikit-learn and TensorFlow. Online courses and tutorials can help you understand the fundamentals. Practice with real datasets from platforms like Kaggle.</p>

                    <h2>The Future</h2>
                    <p>Machine learning continues to advance rapidly. As data becomes more abundant and computing power increases, we'll see even more innovative applications. Understanding the basics now prepares you for an ML-driven future.</p>
                `
            },
            {
                id: 6,
                title: "Travel Guide to Southeast Asia",
                category: "Travel",
                author: "David Lee",
                date: "October 18, 2025",
                excerpt: "Explore the vibrant cultures, stunning landscapes, and incredible cuisine of Southeast Asia with our comprehensive travel guide.",
                icon: "✈️",
                content: `
                    <p>Southeast Asia is a traveler's paradise, offering diverse cultures, breathtaking landscapes, delicious food, and incredible value for money. From pristine beaches to ancient temples, this region has something for everyone.</p>

                    <h2>Must-Visit Destinations</h2>
                    <ul>
                        <li><strong>Thailand</strong> - Temples, beaches, and vibrant street food</li>
                        <li><strong>Vietnam</strong> - Rich history and stunning natural beauty</li>
                        <li><strong>Indonesia</strong> - Thousands of islands to explore</li>
                        <li><strong>Cambodia</strong> - Home to the magnificent Angkor Wat</li>
                        <li><strong>Malaysia</strong> - Modern cities and tropical rainforests</li>
                    </ul>

                    <h2>Best Time to Visit</h2>
                    <p>November to February offers the best weather in most of Southeast Asia - warm, dry, and perfect for exploring. Avoid monsoon season unless you don't mind rain and want to take advantage of lower prices.</p>

                    <h2>Budget Tips</h2>
                    <p>Southeast Asia is incredibly affordable. Street food is delicious and cheap, local transportation is economical, and budget accommodations are plentiful. You can travel comfortably on $30-50 per day.</p>

                    <h2>Cultural Considerations</h2>
                    <p>Respect local customs: dress modestly at temples, remove shoes when entering homes, and learn basic phrases in the local language. A smile goes a long way!</p>

                    <h2>Safety and Health</h2>
                    <p>Southeast Asia is generally safe for travelers. Stay hydrated, use sunscreen, and be cautious with street food at first. Travel insurance is recommended.</p>
                `
            },
            {
                id: 7,
                title: "Mindfulness and Meditation",
                category: "Wellness",
                author: "Lisa Wang",
                date: "October 15, 2025",
                excerpt: "Learn practical mindfulness techniques to reduce stress, improve focus, and enhance your overall well-being in daily life.",
                icon: "🧘",
                content: `
                    <p>In our fast-paced, constantly connected world, mindfulness offers a way to find peace and presence. It's not about emptying your mind, but about being fully present in the moment.</p>

                    <h2>What is Mindfulness?</h2>
                    <p>Mindfulness is the practice of paying attention to the present moment without judgment. It's about observing your thoughts, feelings, and sensations as they arise, without trying to change them.</p>

                    <h2>Benefits of Regular Practice</h2>
                    <ul>
                        <li>Reduced stress and anxiety</li>
                        <li>Improved focus and concentration</li>
                        <li>Better emotional regulation</li>
                        <li>Enhanced self-awareness</li>
                        <li>Improved sleep quality</li>
                        <li>Greater overall well-being</li>
                    </ul>

                    <h2>Simple Meditation Techniques</h2>
                    <h3>Breath Awareness</h3>
                    <p>Focus on your breath as it flows in and out. When your mind wanders (and it will), gently bring your attention back to your breath. Start with just 5 minutes daily.</p>

                    <h3>Body Scan</h3>
                    <p>Lie down and mentally scan your body from head to toe, noticing sensations without judgment. This helps develop body awareness and promotes relaxation.</p>

                    <h3>Walking Meditation</h3>
                    <p>Pay attention to each step, the sensation of your feet touching the ground, and your surroundings. A great option for those who find sitting meditation challenging.</p>

                    <h2>Making it a Habit</h2>
                    <p>Start small and be consistent. Even 5 minutes daily is more valuable than occasional longer sessions. Use apps, join groups, or take classes for support and guidance.</p>
                `
            },
            {
                id: 8,
                title: "Building Better User Interfaces",
                category: "Design",
                author: "Alex Martinez",
                date: "October 12, 2025",
                excerpt: "Principles and best practices for creating intuitive, accessible, and beautiful user interfaces that users love.",
                icon: "🎨",
                content: `
                    <p>Great user interface design is invisible - it just works. When users can accomplish their goals effortlessly, you've succeeded as a designer. Here's how to create interfaces that delight users.</p>

                    <h2>Core Principles of UI Design</h2>
                    <ul>
                        <li><strong>Clarity</strong> - Users should immediately understand what they can do</li>
                        <li><strong>Consistency</strong> - Similar elements should behave similarly</li>
                        <li><strong>Feedback</strong> - Always let users know what's happening</li>
                        <li><strong>Efficiency</strong> - Minimize steps to complete tasks</li>
                        <li><strong>Forgiveness</strong> - Make it easy to undo mistakes</li>
                    </ul>

                    <h2>Visual Hierarchy</h2>
                    <p>Guide users' attention using size, color, contrast, and spacing. The most important elements should be the most prominent. Use whitespace effectively to create breathing room and focus.</p>

                    <h2>Typography Matters</h2>
                    <p>Choose readable fonts and appropriate sizes. Maintain consistent font scales throughout your design. Line height and letter spacing significantly impact readability.</p>

                    <h2>Color Psychology</h2>
                    <p>Colors evoke emotions and convey meaning. Use color purposefully to guide attention, indicate status, and create mood. Always ensure sufficient contrast for accessibility.</p>

                    <h2>Accessibility First</h2>
                    <p>Design for everyone, including users with disabilities. Use semantic HTML, provide alt text for images, ensure keyboard navigation works, and test with screen readers. Accessibility benefits all users.</p>

                    <h2>User Testing</h2>
                    <p>Your assumptions about what works may be wrong. Test with real users early and often. Watch how they interact with your design and iterate based on feedback.</p>
                `
            }
        ];

        let allPosts = [...blogPosts];
        let filteredPosts = [...blogPosts];
        let currentArticle = null;

        function renderPosts(posts) {
            const grid = document.getElementById('blogGrid');
            const noResults = document.getElementById('noResults');
            
            grid.innerHTML = '';
            
            if (posts.length === 0) {
                grid.classList.add('hidden');
                noResults.classList.remove('hidden');
                return;
            }
            
            grid.classList.remove('hidden');
            noResults.classList.add('hidden');
            
            posts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'blog-card';
                card.onclick = () => showArticle(post.id);
                card.innerHTML = `
                    <div class="blog-image">${post.icon}</div>
                    <div class="blog-content">
                        <span class="blog-category">${post.category}</span>
                        <h2 class="blog-title">${post.title}</h2>
                        <div class="blog-meta">${post.author} • ${post.date}</div>
                        <p class="blog-excerpt">${post.excerpt}</p>
                        <a href="#" class="read-more" onclick="event.stopPropagation();">Read More →</a>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        function showArticle(id) {
            currentArticle = blogPosts.find(post => post.id === id);
            if (!currentArticle) return;

            document.getElementById('mainPage').classList.add('hidden');
            document.getElementById('articlePage').classList.remove('hidden');

            document.getElementById('articleCategory').textContent = currentArticle.category;
            document.getElementById('articleTitle').textContent = currentArticle.title;
            document.getElementById('articleMeta').textContent = `${currentArticle.author} • ${currentArticle.date}`;
            document.getElementById('articleBody').innerHTML = currentArticle.content;

            window.scrollTo(0, 0);
        }

        function showMainPage() {
            document.getElementById('articlePage').classList.add('hidden');
            document.getElementById('mainPage').classList.remove('hidden');
            currentArticle = null;
            window.scrollTo(0, 0);
        }

        function searchPosts(query) {
            if (!query.trim()) {
                filteredPosts = [...allPosts];
                updateResultsInfo('');
                renderPosts(filteredPosts);
                return;
            }
            
            const searchTerm = query.toLowerCase();
            
            filteredPosts = allPosts.filter(post => {
                return (
                    post.title.toLowerCase().includes(searchTerm) ||
                    post.category.toLowerCase().includes(searchTerm) ||
                    post.excerpt.toLowerCase().includes(searchTerm) ||
                    post.author.toLowerCase().includes(searchTerm)
                );
            });
            
            updateResultsInfo(query);
            renderPosts(filteredPosts);
        }

        function updateResultsInfo(query) {
            const info = document.getElementById('resultsInfo');
            if (query) {
                const count = filteredPosts.length;
                info.textContent = `Found ${count} article${count !== 1 ? 's' : ''} matching "${query}"`;
            } else {
                info.textContent = '';
            }
        }

        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const backLink = document.getElementById('backLink');

        searchButton.addEventListener('click', () => {
            searchPosts(searchInput.value);
        });

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchPosts(searchInput.value);
            }
        });

        searchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                searchPosts('');
            }
        });

        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            showMainPage();
        });

        // Initial render
        renderPosts(allPosts);