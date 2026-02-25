const API_URL = 'http://localhost:3000/api/products'

document.addEventListener('DOMContentLoaded', () => {

    const itemsGrid = document.getElementById('itemsGrid')
    if (itemsGrid) {
        let allItems = []
        const loader = document.getElementById('loader')
        const emptyState = document.getElementById('emptyState')
        const searchInput = document.getElementById('searchInput')
        const filterBtns = document.querySelectorAll('.filter-btn')

        const fetchItems = async () => {
            try {
                const response = await fetch(API_URL)
                if (!response.ok) throw new Error('API Error')
                allItems = await response.json()
                renderItems(allItems)
            } catch (error) {
                console.error("Failed to load items:", error)
                loader.classList.add('hidden')
                emptyState.innerHTML = '<h2>Erro ao carregar itens</h2><p>Não foi possível conectar ao servidor.</p>'
                emptyState.classList.remove('hidden')
            }
        }

        const renderItems = (itemsToRender) => {
            loader.classList.add('hidden')
            itemsGrid.innerHTML = ''

            if (itemsToRender.length === 0) {
                emptyState.classList.remove('hidden')
                itemsGrid.classList.add('hidden')
            } else {
                emptyState.classList.add('hidden')
                itemsGrid.classList.remove('hidden')

                itemsToRender.forEach(item => {
                    const iconMap = {
                        'Product': 'fa-box',
                        'Movie': 'fa-film',
                        'Music': 'fa-music'
                    }
                    const icon = iconMap[item.category] || 'fa-tag'

                    const date = new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    })

                    const priceFormatted = parseFloat(item.price) > 0
                        ? `R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}`
                        : 'Gratuito/N.A.'

                    const card = document.createElement('div')
                    card.className = 'card'
                    card.innerHTML = `
                        <div class="card-img-container">
                            <span class="card-badge badge-${item.category}">
                                <i class="fa-solid ${icon}"></i> ${item.category === 'Product' ? 'Produto' : item.category === 'Movie' ? 'Filme' : 'Música'}
                            </span>
                            <img src="${item.imageUrl}" alt="${item.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'">
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">${item.name}</h3>
                            <div class="card-price">${priceFormatted}</div>
                            <p class="card-desc">${item.description || 'Sem descrição fornecida.'}</p>
                        </div>
                        <div class="card-footer">
                            <span><i class="fa-regular fa-calendar"></i> Cadastrado em ${date}</span>
                            <span>ID: #${item.id.slice(-4)}</span>
                        </div>
                    `
                    itemsGrid.appendChild(card)
                })
            }
        }

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase()
            const filtered = allItems.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            )

            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter
            const finalFiltered = activeFilter === 'all' ? filtered : filtered.filter(i => i.category === activeFilter)

            renderItems(finalFiltered)
        })

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'))
                const target = e.target.closest('.filter-btn')
                target.classList.add('active')

                const filter = target.dataset.filter
                const term = searchInput.value.toLowerCase()

                let filtered = allItems
                if (filter !== 'all') {
                    filtered = filtered.filter(item => item.category === filter)
                }
                if (term) {
                    filtered = filtered.filter(item =>
                        item.name.toLowerCase().includes(term) ||
                        item.description.toLowerCase().includes(term)
                    )
                }

                renderItems(filtered)
            })
        })

        fetchItems()
    }


    const cadastroForm = document.getElementById('cadastroForm')
    if (cadastroForm) {
        const submitBtn = document.getElementById('submitBtn')
        const toastMessage = document.getElementById('toastMessage')

        const showToast = (message, isError = false) => {
            toastMessage.textContent = message
            toastMessage.className = `toast ${isError ? 'error' : 'success'}`
            toastMessage.classList.remove('hidden')
            setTimeout(() => {
                toastMessage.classList.add('hidden')
            }, 3000)
        }

        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault()

            const originalBtnText = submitBtn.innerHTML
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Salvando...'
            submitBtn.disabled = true

            const formData = {
                name: document.getElementById('name').value,
                category: document.getElementById('category').value,
                price: parseFloat(document.getElementById('price').value || 0),
                imageUrl: document.getElementById('imageUrl').value,
                description: document.getElementById('description').value
            }

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })

                if (!response.ok) throw new Error('Falha ao cadastrar item')

                showToast('Item cadastrado com sucesso!')
                cadastroForm.reset()

                setTimeout(() => {
                    window.location.href = 'index.html'
                }, 1500)

            } catch (error) {
                console.error("Creation error:", error)
                showToast('Ocorreu um erro ao cadastrar o item.', true)
            } finally {
                submitBtn.innerHTML = originalBtnText
                submitBtn.disabled = false
            }
        })
    }
})
