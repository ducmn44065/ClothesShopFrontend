import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SearchResult.module.css";
import ProductShow from "../ProductCard/ProductCard";
import { BACKEND_URL } from "../../env";
import { Product } from "../../utilities/utils";
import LoadingView from "../LoadingView/LoadingView";

const SearchResult: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>("All");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [minValue, setMinValue] = useState<number>(100000);
  const [maxValue, setMaxValue] = useState<number>(1000000);
  const [filteredProductsList, setFilteredProductsList] = useState<Product[]>(
    []
  );
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchName = searchParams.get("name");
  const pageRef = useRef(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [productDetails, setProductDetails] = useState<Product[]>([]);
  const [filteredProductsUpdate, setFilteredProductsUpdate] = useState<
    Product[]
  >([]);

  // Gọi API và so sánh tên tìm kiếm
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchName = searchParams.get("name");
    // get params in URL
    const params = new URLSearchParams();
    params.set("color", selectedColor);
    params.set("size", selectedSize);
    params.set("minValue", minValue.toString());
    params.set("maxValue", maxValue.toString());

    //
    const keywords = searchName?.toLowerCase().split(" ") ?? [];
    // set default value
    setSelectedColor("All");
    setSelectedSize("All size");
    setMinValue(0);
    setMaxValue(1000000);

    //
    fetch(BACKEND_URL + `/products/?page=${pageRef.current}`)
      .then((res) => res.json())
      .then((productsJson: Product[]) => {
        const filteredProducts = productsJson.filter((product) => {
          const productName = product.name.toLowerCase();
          const keywordMatch = keywords.every((keyword) => {
            return productName.includes(keyword);
          });
          return keywordMatch;
        });
        setFilteredProductsList(filteredProducts);
        setProducts(productsJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.search]);

  const colors = [
    ...new Set(productDetails.flatMap((product) => product.colorcode)),
  ];
  const sizes = [...new Set(productDetails.flatMap((product) => product.size))];

  useEffect(() => {
    try {
      fetch(BACKEND_URL + "/products/all")
        .then((response) => response.json())
        .then((products) => {
          setProductDetails(products);
        });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
  }, [products]);

  const getMinPrice = () => {
    const prices = productDetails.map((product) => product.price);
    return Math.min(...prices);
  };

  const getMaxPrice = () => {
    const prices = productDetails.map((product) => product.price);
    return Math.max(...prices);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinValue(value);
    // Kiểm tra nếu giá trị của maxInput nhỏ hơn giá trị của minInput thì cập nhật lại giá trị của maxInput
    if (value > maxValue) {
      setMaxValue(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMaxValue(value);
    // Kiểm tra nếu giá trị của minInput lớn hơn giá trị của maxInput thì cập nhật lại giá trị của minInput
    if (value < minValue) {
      setMinValue(value);
    }
  };

  const [sortOrder, setSortOrder] = useState("asc");
  const handlePriceSortasc = () => {
    const sortedProducts = filteredProductsList
      .slice()
      .sort((a, b) => a.price - b.price);
    setFilteredProductsList(sortedProducts);
    setSortOrder("asc");
  };

  const handlePriceSortdesc = () => {
    const sortedProducts = filteredProductsList
      .slice()
      .sort((a, b) => b.price - a.price);
    setFilteredProductsList(sortedProducts);
    setSortOrder("desc");
  };

  function handleFilterToggle() {
    setShowFilter(!showFilter);
  }
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    if (filteredProductsList.length === 0) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setIsLoading(false);
    }
  }, [filteredProductsList]);

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const handleSizeChange = (size: string) => {
    const index = selectedSizes.indexOf(size);
    if (index === -1) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      const updatedSizes = [...selectedSizes];
      updatedSizes.splice(index, 1);
      setSelectedSizes(updatedSizes);
    }
  };

  const isSizeSelected = (size: string) => {
    return selectedSizes.includes(size);
  };

  const handleColorChange = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(
        selectedColors.filter((selectedColor) => selectedColor !== color)
      );
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const isColorSelected = (color: string) => {
    return selectedColors.includes(color);
  };

  const handleFilterSubmit = () => {
    if (productDetails.length > 0) {
      const searchName = searchParams.get("name");
      const filteredProducts = productDetails.filter((product) => {
        // Áp dụng các điều kiện lọc tại đây
        const productName = product.name.toLowerCase();
        const productPrice = product.price;
        const productColor = product.colorcode;
        const productSize = product.size;

        const nameMatch = searchName
          ? productName.includes(searchName.toLowerCase())
          : true;
        const priceMatch = productPrice >= minValue && productPrice <= maxValue;
        const colorMatch =
          selectedColors.length === 0 || selectedColors.includes(productColor);
        const sizeMatch =
          selectedSizes.length === 0 || selectedSizes.includes(productSize);

        return nameMatch && priceMatch && colorMatch && sizeMatch;
      });

      const uniqueNames = [
        ...new Set(filteredProducts.map((product) => product.name)),
      ];
      const updatedFilteredProductsList = products.filter((product) =>
        uniqueNames.includes(product.name)
      );

      setFilteredProductsUpdate(filteredProducts);
      setFilteredProductsList(updatedFilteredProductsList);
      console.log("Pd: ", productDetails);
    }
    handleFilterToggle();
  };

  return (
    <div>
      <div className={`${styles["container"]}`}>
        <div className={styles["wraper-filter"]}>
          <div className={styles["wrap"]}>
            <a
              className={`link-dark text-decoration-none ${styles["filter-toggle"]} d-flex gap-3 align-items-center`}
              onClick={handleFilterToggle}
            >
              <b style={{ userSelect: "none" }}>Filter</b>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-funnel"
                viewBox="0 0 16 16"
              >
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z" />
              </svg>
            </a>
            <div
              className={`${styles["filter-container"]} ${
                showFilter ? styles["filter-container-open"] : ""
              }`}
            >
              <form>
                <div className="row my-2 filter">
                  <div className="col-md-3 col-lg-3 select-color">
                    <label>
                      <span style={{ userSelect: "none" }}>Color:</span>
                      <div className="color-container">
                        {colors.map((color, index) => (
                          <label
                            key={index}
                            style={{
                              backgroundColor: color,
                              position: "relative",
                              opacity: 0.8,
                            }}
                            className={`${styles["select-color"]} m-2`}
                          >
                            <input
                              type="checkbox"
                              value={color}
                              checked={isColorSelected(color)}
                              onChange={() => handleColorChange(color)}
                              style={{ opacity: 0 }}
                            />
                            {isColorSelected(color) && (
                              <div
                                className={`${styles["checkmark"]}`}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                              >
                                &#10003;
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                    </label>
                  </div>
                  <div className="col-md-3 col-lg-3 select-size mb-3">
                    <span style={{ userSelect: "none" }}>Size:</span>
                    <div className={`${styles["size-container"]} d-flex `}>
                      {sizes.map((size, index) => (
                        <>
                          <label
                            key={index}
                            style={{
                              backgroundColor: isSizeSelected(size)
                                ? "#B799FF"
                                : "transparent",
                            }}
                            className="d-flex justify-content-center align-items-center"
                            htmlFor={"_" + index + size}
                          >
                            <span style={{ userSelect: "none" }}>{size}</span>
                          </label>
                          <input
                            type="checkbox"
                            value={size}
                            checked={selectedSizes.includes(size)}
                            onChange={() => handleSizeChange(size)}
                            style={{ opacity: 0 }}
                            name={"_" + index + size}
                            id={"_" + index + size}
                            className={`${styles.hidden}`}
                          />
                        </>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <span style={{ userSelect: "none" }}>
                      Price:{" "}
                      <b>
                        {minValue}VNĐ - {maxValue}VNĐ
                      </b>
                    </span>
                  </div>
                  <div
                    className={`col-md-5 col-lg-3 ${styles["select-price"]}`}
                  >
                    <input
                      type="range"
                      className={`${styles["price-min"]} ${styles["range-slider"]} form-range mb-2`}
                      min={0}
                      max={getMaxPrice()}
                      value={minValue === Infinity ? 10000 : minValue}
                      step="10000"
                      onChange={handleMinChange}
                    />
                    <input
                      type="range"
                      className={`${styles["price-max"]} ${styles["range-slider"]} form-range`}
                      min={0}
                      max={getMaxPrice()}
                      value={maxValue}
                      step="10000"
                      onChange={handleMaxChange}
                    />
                  </div>
                </div>
              </form>
              <a
                href="#"
                onClick={handleFilterSubmit}
                className={styles["filter-button"]}
              >
                Lọc
              </a>
              <div className={styles["sort-section"]}>
                <span style={{ userSelect: "none" }}>Sort order:</span>
                <a
                  href="#"
                  onClick={handlePriceSortasc}
                  className={`${sortOrder === "asc" ? styles["active"] : ""}`}
                >
                  <span style={{ userSelect: "none" }}>ASC</span>
                </a>
                <a
                  href="#"
                  onClick={handlePriceSortdesc}
                  className={`${sortOrder === "desc" ? styles["active"] : ""}`}
                >
                  <span style={{ userSelect: "none" }}>DESC</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className={`${styles["render-product"]}`}>
          <br />
          <h2>Kết quả tìm kiếm cho: {searchName}</h2>
          <hr />
          {isLoading ? (
            <LoadingView />
          ) : (
            <div className={`${styles.content}`}>
              {filteredProductsList.length > 0 ? (
                filteredProductsList.map((product: Product) => (
                  <ProductShow
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imgUrl={product.imageurl}
                  />
                ))
              ) : (
                <p>Không tìm thấy kết quả nào.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
