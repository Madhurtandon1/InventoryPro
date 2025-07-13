import mongoose, {Schema} from "mongoose"

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        sku: {
            type: String,
            required: true,
            
        },
        description: {
            type: String,
            
        },
        price:{
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        category: {
            type: String
        },
        image: {
            type: String
        },
        supplier: {
            type: String
        },
         createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }

    },   { timestamps: true }

)

productSchema.index({ createdBy: 1, sku: 1 }, { unique: true });

export const Product = mongoose.model("Product", productSchema)