// ExternalServices.mjs

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;  // Local JSON file for products by category
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then(data => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find(item => item.Id === id);
  }

  async checkout(order) {
  try {
    const response = await fetch("http://wdd330-backend.onrender.com/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response body:', text);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}: ${text}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Checkout failed:", error);
    throw error;
  }
}

}
