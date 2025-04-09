import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategoryGrid.module.css";
import categories from "../../assets/categories";

export default function CategoryGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (categoryName) => {
    localStorage.setItem("selectedCategory", categoryName); // Save to localStorage
    navigate("/require"); // Redirect to form page
  };

  return (
    <section className={styles["categories-container"]}>
      <h2>Browse Categories</h2>

      <input
        type="text"
        placeholder="Search by category name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.container}>
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className={styles.category}
            onClick={() => handleClick(category.name)}
            style={{ cursor: "pointer" }}
          >
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
