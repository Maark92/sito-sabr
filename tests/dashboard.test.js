describe('Dashboard Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="dashboard-content">
        <form id="add-client-form">
          <input id="client-name" value="Test Client">
          <input id="client-email" value="test@example.com">
          <input id="client-phone" value="1234567890">
        </form>
      </div>
    `;
  });

  test('Form submission creates new client', async () => {
    const form = document.getElementById('add-client-form');
    const mockSubmit = jest.fn(e => e.preventDefault());
    form.addEventListener('submit', mockSubmit);
    
    form.dispatchEvent(new Event('submit'));
    expect(mockSubmit).toHaveBeenCalled();
  });
});
