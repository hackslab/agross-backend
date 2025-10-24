# Agross User API Documentation

This document provides a clear and concise guide for client-side developers on how to consume the public, read-only endpoints of the Agross backend API. All endpoints listed here are publicly accessible and do not require authentication.

The base URL for all API endpoints is `http://localhost:3000`.

## File Upload Policy

**Note for Client Developers**: All media assets (images, videos) in this API are managed through secure file upload endpoints on the admin side. Media URLs returned in API responses are read-only and point to the application's designated storage. Client applications should never attempt to modify or upload media directly - this is handled exclusively through the admin interface.

## Common Responses

All endpoints may return the following error responses in addition to their specific success responses:

- `404 Not Found`: The requested resource (e.g., a category or product with a specific ID) does not exist.
- `500 Internal Server Error`: An unexpected error occurred on the server.

---

## Categories

Endpoints for retrieving product categories.

### Get All Categories

- **Method**: `GET`
- **Endpoint**: `/categories`
- **Description**: Retrieves a list of all product categories, with their subcategories nested.
- **Authentication**: `Public`

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  [
    {
      "id": "category-uuid-1",
      "name_ru": "Фрукты",
      "name_en": "Fruits",
      "name_uz": "Mevalar",
      "name_kz": "Жемістер",
      "description_ru": "Свежие и сочные фрукты.",
      "description_en": "Fresh and juicy fruits.",
      "description_uz": "Yangi va sersuv mevalar.",
      "description_kz": "Жаңа піскен және шырынды жемістер.",
      "image": "https://your-storage-url.com/categories/image1.jpg",
      "subcategories": [
        {
          "id": "subcategory-uuid-1",
          "name_ru": "Цитрусовые",
          "name_en": "Citrus",
          "name_uz": "Sitrus mevalar",
          "name_kz": "Цитрусты жемістер",
          "categoryId": "category-uuid-1"
        },
        {
          "id": "subcategory-uuid-2",
          "name_ru": "Ягоды",
          "name_en": "Berries",
          "name_uz": "Reza mevalar",
          "name_kz": "Жідектер",
          "categoryId": "category-uuid-1"
        }
      ]
    }
  ]
  ```

### Get Category by ID

- **Method**: `GET`
- **Endpoint**: `/categories/:id`
- **Description**: Retrieves a single category by its unique identifier, including its subcategories and associated products.
- **Authentication**: `Public`

#### Parameters

| Name | Type   | In   | Description                            |
| ---- | ------ | ---- | -------------------------------------- |
| `id` | `UUID` | Path | The unique identifier of the category. |

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  {
    "id": "category-uuid-1",
    "name_ru": "Фрукты",
    "name_en": "Fruits",
    "name_uz": "Mevalar",
    "name_kz": "Жемістер",
    "description_ru": "Свежие и сочные фрукты.",
    "description_en": "Fresh and juicy fruits.",
    "description_uz": "Yangi va sersuv mevalar.",
    "description_kz": "Жаңа піскен және шырынды жемістер.",
    "image": "https://your-storage-url.com/categories/image1.jpg",
    "subcategories": [
      {
        "id": "subcategory-uuid-1",
        "name_ru": "Цитрусовые",
        "name_en": "Citrus",
        "name_uz": "Sitrus mevalar",
        "name_kz": "Цитрусты жемістер",
        "categoryId": "category-uuid-1"
      }
    ],
    "products": [
      {
        "id": "product-uuid-1",
        "name_ru": "Органические апельсины",
        "name_en": "Organic Oranges",
        "price": 3.99,
        "...": "..."
      }
    ]
  }
  ```

---

## Subcategories

Endpoints for retrieving product subcategories.

### Get All Subcategories

- **Method**: `GET`
- **Endpoint**: `/subcategories`
- **Description**: Retrieves a list of all product subcategories, with their parent category nested.
- **Authentication**: `Public`

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  [
    {
      "id": "subcategory-uuid-1",
      "name_ru": "Цитрусовые",
      "name_en": "Citrus",
      "name_uz": "Sitrus mevalar",
      "name_kz": "Цитрусты жемістер",
      "categoryId": "category-uuid-1",
      "category": {
        "id": "category-uuid-1",
        "name_ru": "Фрукты",
        "name_en": "Fruits",
        "name_uz": "Mevalar",
        "name_kz": "Жемістер",
        "description_ru": "Свежие и сочные фрукты.",
        "description_en": "Fresh and juicy fruits.",
        "description_uz": "Yangi va sersuv mevalar.",
        "description_kz": "Жаңа піскен және шырынды жемістер.",
        "image": "https://your-storage-url.com/categories/image1.jpg"
      }
    }
  ]
  ```

### Get Subcategory by ID

- **Method**: `GET`
- **Endpoint**: `/subcategories/:id`
- **Description**: Retrieves a single subcategory by its unique identifier, including its parent category.
- **Authentication**: `Public`

#### Parameters

| Name | Type   | In   | Description                               |
| ---- | ------ | ---- | ----------------------------------------- |
| `id` | `UUID` | Path | The unique identifier of the subcategory. |

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  {
    "id": "subcategory-uuid-1",
    "name_ru": "Цитрусовые",
    "name_en": "Citrus",
    "name_uz": "Sitrus mevalar",
    "name_kz": "Цитрусты жемістер",
    "categoryId": "category-uuid-1",
    "category": {
      "id": "category-uuid-1",
      "name_ru": "Фрукты",
      "name_en": "Fruits",
      "name_uz": "Mevalar",
      "name_kz": "Жемістер",
      "description_ru": "Свежие и сочные фрукты.",
      "description_en": "Fresh and juicy fruits.",
      "description_uz": "Yangi va sersuv mevalar.",
      "description_kz": "Жаңа піскен және шырынды жемістер.",
      "image": "https://your-storage-url.com/categories/image1.jpg"
    }
  }
  ```

---

## Products

Endpoints for retrieving products.

### Get All Products

- **Method**: `GET`
- **Endpoint**: `/products`
- **Description**: Retrieves a list of all available products (non-soft-deleted). Product files are returned ordered by their `order` field in ascending order.
- **Authentication**: `Public`

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  [
    {
      "id": "product-uuid-1",
      "name_ru": "Органические яблоки",
      "name_en": "Organic Apples",
      "name_uz": "Organik olmalar",
      "name_kz": "Органикалық алмалар",
      "description_ru": "Хрустящие и вкусные органические яблоки.",
      "description_en": "Crisp and delicious organic apples.",
      "description_uz": "Qarsildoq va mazali organik olmalar.",
      "description_kz": "Қытырлақ және дәмді органикалық алмалар.",
      "price": 2.99,
      "structure_ru": "Белки, жиры, углеводы",
      "structure_en": "Proteins, fats, carbohydrates",
      "structure_uz": "Oqsillar, yog'lar, uglevodlar",
      "structure_kz": "Ақуыздар, майлар, көмірсулар",
      "quantity": 100,
      "unitId": "unit-uuid",
      "viewCount": 15,
      "isDeleted": false,
      "categoryId": "category-uuid",
      "subcategoryId": "subcategory-uuid",
      "countryId": "country-uuid",
      "category": { "...": "..." },
      "subcategory": { "...": "..." },
      "country": { "...": "..." },
      "unit": { "id": "unit-uuid", "name": "kg" },
      "files": [
        {
          "id": "file-uuid-1",
          "isVideo": false,
          "url": "https://your-storage-url.com/products/image.jpg",
          "order": 0,
          "productId": "product-uuid-1"
        }
      ]
    }
  ]
  ```

### Get Product by ID

- **Method**: `GET`
- **Endpoint**: `/products/:id`
- **Description**: Retrieves a single product by its unique identifier. This action also increments the product's `viewCount`. Product files are returned ordered by their `order` field in ascending order.
- **Authentication**: `Public`

#### Parameters

| Name | Type   | In   | Description                           |
| ---- | ------ | ---- | ------------------------------------- |
| `id` | `UUID` | Path | The unique identifier of the product. |

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  {
    "id": "product-uuid-1",
    "name_ru": "Органические яблоки",
    "name_en": "Organic Apples",
    "name_uz": "Organik olmalar",
    "name_kz": "Органикалық алмалар",
    "description_ru": "Хрустящие и вкусные органические яблоки.",
    "description_en": "Crisp and delicious organic apples.",
    "description_uz": "Qarsildoq va mazali organik olmalar.",
    "description_kz": "Қытырлақ және дәмді органикалық алмалар.",
    "price": 2.99,
    "structure_ru": "Белки, жиры, углеводы",
    "structure_en": "Proteins, fats, carbohydrates",
    "structure_uz": "Oqsillar, yog'lar, uglevodlar",
    "structure_kz": "Ақуыздар, майлар, көмірсулар",
    "quantity": 100,
    "unitId": "unit-uuid",
    "viewCount": 16,
    "isDeleted": false,
    "categoryId": "category-uuid",
    "subcategoryId": "subcategory-uuid",
    "countryId": "country-uuid",
    "category": { "...": "..." },
    "subcategory": { "...": "..." },
    "country": { "...": "..." },
    "unit": { "id": "unit-uuid", "name": "kg" },
    "files": [
      {
        "id": "file-uuid-1",
        "isVideo": false,
        "url": "https://your-storage-url.com/products/image.jpg",
        "order": 0,
        "productId": "product-uuid-1"
      }
    ]
  }
  ```

---

## Countries

Endpoints for retrieving countries of origin.

### Get All Countries

- **Method**: `GET`
- **Endpoint**: `/countries`
- **Description**: Retrieves a list of all countries.
- **Authentication**: `Public`

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  [
    {
      "id": "country-uuid-1",
      "name": "Brazil"
    },
    {
      "id": "country-uuid-2",
      "name": "Spain"
    }
  ]
  ```

### Get Country by ID

- **Method**: `GET`
- **Endpoint**: `/countries/:id`
- **Description**: Retrieves a single country by its unique identifier.
- **Authentication**: `Public`

#### Parameters

| Name | Type   | In   | Description                           |
| ---- | ------ | ---- | ------------------------------------- |
| `id` | `UUID` | Path | The unique identifier of the country. |

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  {
    "id": "country-uuid-1",
    "name": "Brazil"
  }
  ```

---

## Units

Endpoints for retrieving product units.

### Get All Units

- **Method**: `GET`
- **Endpoint**: `/units`
- **Description**: Retrieves a list of all units.
- **Authentication**: `Public`

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  [
    {
      "id": "unit-uuid-1",
      "name": "kg"
    },
    {
      "id": "unit-uuid-2",
      "name": "piece"
    }
  ]
  ```

### Get Unit by ID

- **Method**: `GET`
- **Endpoint**: `/units/:id`
- **Description**: Retrieves a single unit by its unique identifier.
- **Authentication**: `Public`

#### Parameters

| Name | Type   | In   | Description                        |
| ---- | ------ | ---- | ---------------------------------- |
| `id` | `UUID` | Path | The unique identifier of the unit. |

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  {
    "id": "unit-uuid-1",
    "name": "kg"
  }
  ```

---

## Currency

Endpoint for retrieving the current USD exchange rate.

### Get Current USD Exchange Rate

- **Method**: `GET`
- **Endpoint**: `/currency`
- **Description**: Retrieves the current buy and sell rates for USD.
- **Authentication**: `Public`

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  {
    "buy": 12060.0,
    "sell": 12180.0
  }
  ```

---

## Carousel

Endpoints for retrieving carousel images for the home page.

### Get All Carousel Items

- **Method**: `GET`
- **Endpoint**: `/carousel`
- **Description**: Retrieves a list of all carousel items.
- **Authentication**: `Public`

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  [
    {
      "id": "carousel-item-uuid-1",
      "file": "https://your-storage-url.com/carousel/image1.jpg"
    },
    {
      "id": "carousel-item-uuid-2",
      "file": "https://your-storage-url.com/carousel/image2.jpg"
    }
  ]
  ```

### Get Carousel Item by ID

- **Method**: `GET`
- **Endpoint**: `/carousel/:id`
- **Description**: Retrieves a single carousel item by its unique identifier.
- **Authentication**: `Public`

#### Parameters

| Name | Type   | In   | Description                                 |
| ---- | ------ | ---- | ------------------------------------------- |
| `id` | `UUID` | Path | The unique identifier of the carousel item. |

#### Responses

- **Success Response (`200 OK`)**
  **Example:**
  ```json
  {
    "id": "carousel-item-uuid-1",
    "file": "https://your-storage-url.com/carousel/image1.jpg"
  }
  ```
