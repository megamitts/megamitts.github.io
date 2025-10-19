document.addEventListener('DOMContentLoaded', function() {
            const pages = document.querySelectorAll('.page');
            // const prevBtn = document.getElementById('prev-btn'); // REMOVE THIS LINE
            // const nextBtn = document.getElementById('next-btn'); // REMOVE THIS LINE
            const leftClickArea = document.getElementById('left-click');
            const rightClickArea = document.getElementById('right-click');
            
            let currentPage = 0;
            const totalPages = pages.length - 1;
            
            // Initialize pages
            function initializeBook() {
                pages.forEach((page, index) => {
                    page.style.zIndex = totalPages - index;
                    // Explicitly set initial transform for Firefox
                    page.style.transform = 'rotateY(0deg) translateZ(0px)';
                    page.style.webkitTransform = 'rotateY(0deg) translateZ(0px)';
                    page.style.mozTransform = 'rotateY(0deg) translateZ(0px)';
                });
                updateClickableAreas(); // We'll rename updateButtons for clarity
            }
            
            // Renamed this function as it no longer updates buttons
            function updateClickableAreas() {
                // Hide the left clickable area on the cover page (page 0)
                if (currentPage === 0) {
                    leftClickArea.style.display = 'none';
                } else {
                    leftClickArea.style.display = 'block';
                }
                if (currentPage === 4) {
                    rightClickArea.style.display = 'none';
                } else {
                    rightClickArea.style.display = 'block';
                }
            }
            
            function nextPage() {
                if (currentPage >= totalPages) return;
                
                // Flip the current page with cross-browser transforms
                pages[currentPage].style.transform = 'rotateY(-180deg) translateZ(0px)';
                pages[currentPage].style.webkitTransform = 'rotateY(-180deg) translateZ(0px)';
                pages[currentPage].style.mozTransform = 'rotateY(-180deg) translateZ(0px)';
                pages[currentPage].style.zIndex = currentPage;
                
                currentPage++;
                updateClickableAreas();
            }
            
            function prevPage() {
                if (currentPage <= 0) return;
                
                currentPage--;
                
                // Restore z-index first, then flip back with cross-browser transforms
                pages[currentPage].style.zIndex = totalPages - currentPage;
                pages[currentPage].style.transform = 'rotateY(0deg) translateZ(0px)';
                pages[currentPage].style.webkitTransform = 'rotateY(0deg) translateZ(0px)';
                pages[currentPage].style.mozTransform = 'rotateY(0deg) translateZ(0px)';
                
                updateClickableAreas();
            }
            
            // Event listeners
            // nextBtn.addEventListener('click', nextPage); // REMOVE THIS LINE
            // prevBtn.addEventListener('click', prevPage); // REMOVE THIS LINE
            leftClickArea.addEventListener('click', prevPage);
            rightClickArea.addEventListener('click', nextPage);
            
            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight') {
                    nextPage();
                } else if (e.key === 'ArrowLeft') {
                    prevPage();
                }
            });
            
            // Touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            
            document.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            document.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                
                if (touchStartX - touchEndX > swipeThreshold) {
                    nextPage();
                } else if (touchEndX - touchStartX > swipeThreshold) {
                    prevPage();
                }
            }
            
            // Initialize the book
            initializeBook();
        });