import { Request, Response } from "express";
import { send } from "process";
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProduct,
  findProduct,
  findAndUpdateProduct,
  deleteProduct,
} from "../service/product.service";

export const createProductHandler = async (
  request: Request<{}, {}, CreateProductInput["body"]>,
  response: Response
) => {
  const userId = response.locals.user._id;

  try {
    const product = await createProduct({ ...request.body, user: userId });
    return response.send(product);
  } catch (error) {
    return response.send(error);
  }
};

export const getProductHandler = async (
  request: Request<GetProductInput["params"]>,
  response: Response
) => {
  const productId = request.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return response.sendStatus(404);
  }

  return response.send(product);
};

export const updateProductHandler = async (
  request: Request<
    UpdateProductInput["params"],
    {},
    UpdateProductInput["body"]
  >,
  response: Response
) => {
  const userId = response.locals.user._id;

  const productId = request.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return response.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return response.sendStatus(403);
  }

  const updatedProduct = await findAndUpdateProduct(
    { productId },
    request.body,
    { new: true }
  );

  return response.send(updatedProduct);
};

export const deleteProductHandler = async (
  request: Request<DeleteProductInput["params"]>,
  response: Response
) => {
  const userId = response.locals.user._id;

  const productId = request.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return response.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return response.sendStatus(403);
  }

  await deleteProduct({ productId });

  return response.sendStatus(200);
};
