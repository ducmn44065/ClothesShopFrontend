import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Product } from "../../../../utilities/utils";
import { BACKEND_URL } from "../../../../env";
import style from "./productdetail.module.css";
import Carousel from "../../../Carousel/Carousel";
import LoadingView from "../../../LoadingView/LoadingView";
import { CommentType } from "../../../CommentBox/CommentBox";
import ValidInput from "../../../ValidInput/ValidInput";
import Editable from "../../../Editable/Editable";
import { Category } from "../../Category/Categories/Categories";
import AddProduct from "../AddProduct/AddProduct";

function ProductDetail() {
  const params = useParams();
  const [products, setProducts] = useState([] as Product[]);
  const [comments, setComments] = useState([] as CommentType[]);
  const [categories, setCategories] = useState([] as Category[]);
  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingComment, setIsLoadingComment] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState<undefined | boolean>(undefined);
  /// state:
  const [name, setName] = useState("");
  const [categoryId, setCategoryID] = useState("");
  const [isShowingAddPanel, setIsShowingAddPanel] = useState(false);
  useEffect(() => {
    fetch(BACKEND_URL + "/products/" + params.id).then(async (response) => {
      const products = await response.json();
      setProducts(products);
      if (products.length > 0) {
        setName(products[0].name);
        setCategoryID(products[0].categoryid);
      }
      setIsLoading(false);
    });
    fetch(BACKEND_URL + "/comments/product/" + params.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
        setIsLoadingComment(false);
      })
      .catch((err) => {
        console.log(err);
      });
    fetch(BACKEND_URL + "/categories")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return isLoading ? (
    <LoadingView />
  ) : (
    <>
      <div className={`${style.container}`}>
        <div
          className={`d-flex justify-content-between align-items-center gap-3 ${style.card}`}
        >
          <div className="d-flex justify-content-center align-items-center">
            <div className={`${style.carousel}`}>
              <Carousel imgUrls={products.map((p) => p.imageurl)} />
            </div>
          </div>
          <div className="flex-grow-1 w-100">
            <div>
              <div className={`${style["text-group"]}`}>
                <label htmlFor="">ID</label>
                <Editable
                  canEdit={false}
                  type="text"
                  value={products[0].infoid}
                />
              </div>
              <div className={`${style["text-group"]}`}>
                <label htmlFor="">Name</label>
                <Editable
                  canEdit={true}
                  type="text"
                  value={products[0].name}
                  onChange={(e) => {
                    setName(e);
                  }}
                />
              </div>
              <div className={`${style["text-group"]}`}>
                <label htmlFor="">Category</label>
                <Editable
                  canEdit={true}
                  type="text"
                  value={products[0].categoryid}
                  values={categories.map((category) => {
                    return {
                      key: category.id,
                      text: category.name,
                    };
                  })}
                  onChange={(e) => {
                    setCategoryID(e);
                  }}
                />
              </div>
              {isUpdated == true && (
                <div className={`${style["text-group"]}`}>
                  <div className="alert alert-success">Updated</div>
                </div>
              )}{" "}
              {isUpdated == false && (
                <div className={`${style["text-group"]}`}>
                  <div className="alert alert-danger">Error</div>
                </div>
              )}
              <div className={`${style["text-group"]} text-end`}>
                {isUpdating ? (
                  <div
                    className="spinner-border text-danger spinnner-sm"
                    role="status"
                  ></div>
                ) : (
                  <button
                    onClick={(e) => {
                      setIsUpdating(true);
                      update({
                        name: name,
                        categoryid: categoryId,
                        infoid: params.id!,
                      })
                        .then(async (response) => {
                          if (response.status == 200) {
                            setIsUpdated(true);
                          } else {
                            console.log(await response.json());

                            setIsUpdated(false);
                          }
                        })
                        .finally(() => {
                          setIsUpdating(false);
                        });
                    }}
                    className="btn btn-sm btn-danger"
                  >
                    Save changes
                  </button>
                )}
              </div>
            </div>
            <div className={`${style["text-group"]} text-end`}>
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  setIsShowingAddPanel(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        <div>
          <hr />
          <div>
            <span>Review</span>
            <div className="mt-3 d-flex justify-content-center flex-column">
              {isLoadingComment ? (
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : comments.length == 0 ? (
                <div className="alert alert-info">No comments</div>
              ) : (
                comments.map((comment, index) => (
                  <div
                    key={index}
                    className="alert alert-primary d-flex w-100 justify-content-between mb-3"
                  >
                    <div className="d-flex gap-1 align-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-person"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                      </svg>
                      <div className={`${style["border-right"]}`}>
                        {comment.fullname}
                      </div>
                      <div className="text-primary">{comment.comment}</div>
                    </div>
                    <div className="text-muted">
                      {comment.datecreated.substring(0, 10)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {isShowingAddPanel && <AddProduct onClose={setIsShowingAddPanel} />}
    </>
  );
}

function update({
  name,
  categoryid,
  infoid,
}: {
  name: string;
  categoryid: string;
  infoid: string;
}) {
  return fetch(BACKEND_URL + "/products/" + infoid, {
    method: "PUT",
    body: JSON.stringify({ name, categoryid }),
  });
}

export default ProductDetail;
