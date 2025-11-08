const socket = io();

socket.on('products:update', (products) => {
  const ul = document.getElementById('list');
  ul.innerHTML = products.map(p =>
    `<li data-id="${p.id}"><strong>${p.title}</strong> — $ ${p.price} (id: ${p.id})</li>`
  ).join('');
});

document.getElementById('createForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ title: fd.get('title'), price: fd.get('price') })
  });
  e.currentTarget.reset();
});

document.getElementById('deleteForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  await fetch(`/api/products/${fd.get('pid')}`, { method: 'DELETE' });
  e.currentTarget.reset();
});
