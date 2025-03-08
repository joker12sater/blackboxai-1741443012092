// Toast notification system
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out ${
            type === 'error' ? 'bg-red-500' :
            type === 'success' ? 'bg-green-500' :
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
        }`;
        toast.textContent = message;

        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
        });

        // Remove after duration
        setTimeout(() => {
            toast.style.transform = 'translateY(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
}

// Loading spinner
class LoadingSpinner {
    static show(container = document.body) {
        const spinner = document.createElement('div');
        spinner.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
        spinner.innerHTML = `
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        `;
        spinner.id = 'loading-spinner';
        container.appendChild(spinner);
    }

    static hide() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// Modal dialog
class Modal {
    constructor(options = {}) {
        this.options = {
            title: '',
            content: '',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            onConfirm: () => {},
            onCancel: () => {},
            ...options
        };

        this.element = null;
        this.createModal();
    }

    createModal() {
        this.element = document.createElement('div');
        this.element.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
        this.element.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 class="text-xl font-bold mb-4">${this.options.title}</h2>
                <div class="mb-6">${this.options.content}</div>
                <div class="flex justify-end space-x-2">
                    <button class="cancel-btn px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        ${this.options.cancelText}
                    </button>
                    <button class="confirm-btn px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        ${this.options.confirmText}
                    </button>
                </div>
            </div>
        `;

        // Event listeners
        this.element.querySelector('.confirm-btn').addEventListener('click', () => {
            this.options.onConfirm();
            this.close();
        });

        this.element.querySelector('.cancel-btn').addEventListener('click', () => {
            this.options.onCancel();
            this.close();
        });
    }

    show() {
        document.body.appendChild(this.element);
    }

    close() {
        this.element.remove();
    }
}

// Form validation
class FormValidator {
    static validate(form, rules) {
        const errors = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = form[field]?.value;
            
            for (const rule of fieldRules) {
                if (rule.required && !value) {
                    errors[field] = `${field} is required`;
                    break;
                }
                
                if (rule.minLength && value.length < rule.minLength) {
                    errors[field] = `${field} must be at least ${rule.minLength} characters`;
                    break;
                }
                
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors[field] = `${field} must be less than ${rule.maxLength} characters`;
                    break;
                }
                
                if (rule.pattern && !rule.pattern.test(value)) {
                    errors[field] = rule.message || `${field} is invalid`;
                    break;
                }
                
                if (rule.custom && !rule.custom(value)) {
                    errors[field] = rule.message || `${field} is invalid`;
                    break;
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Pagination component
class Pagination {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            totalPages: 1,
            currentPage: 1,
            onPageChange: () => {},
            ...options
        };
        
        this.render();
    }

    render() {
        const { totalPages, currentPage } = this.options;
        
        this.container.innerHTML = `
            <div class="flex items-center justify-center space-x-2">
                <button class="prev-btn px-3 py-1 rounded border ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'
                }" ${currentPage === 1 ? 'disabled' : ''}>
                    Previous
                </button>
                
                <div class="flex items-center space-x-1">
                    ${this.generatePageNumbers()}
                </div>
                
                <button class="next-btn px-3 py-1 rounded border ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'
                }" ${currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        `;

        // Event listeners
        this.container.querySelector('.prev-btn').addEventListener('click', () => {
            if (currentPage > 1) {
                this.options.onPageChange(currentPage - 1);
            }
        });

        this.container.querySelector('.next-btn').addEventListener('click', () => {
            if (currentPage < totalPages) {
                this.options.onPageChange(currentPage + 1);
            }
        });

        this.container.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page !== currentPage) {
                    this.options.onPageChange(page);
                }
            });
        });
    }

    generatePageNumbers() {
        const { totalPages, currentPage } = this.options;
        let pages = [];
        
        // Always show first page
        pages.push(1);
        
        // Show dots after first page if needed
        if (currentPage > 3) {
            pages.push('...');
        }
        
        // Show current page and surrounding pages
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        
        // Show dots before last page if needed
        if (currentPage < totalPages - 2) {
            pages.push('...');
        }
        
        // Always show last page if more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages.map(page => {
            if (page === '...') {
                return '<span class="px-3 py-1">...</span>';
            }
            return `
                <button class="page-btn px-3 py-1 rounded border ${
                    page === currentPage ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'
                }" data-page="${page}">
                    ${page}
                </button>
            `;
        }).join('');
    }

    update(options) {
        this.options = {
            ...this.options,
            ...options
        };
        this.render();
    }
}

export {
    Toast,
    LoadingSpinner,
    Modal,
    FormValidator,
    Pagination
};
