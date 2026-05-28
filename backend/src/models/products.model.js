import mongoose, {Schema} from "mongoose"

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
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
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
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
productSchema.index({createdBy: 1,createdAt: -1});
productSchema.index({createdBy: 1,category: 1});
productSchema.index({createdBy: 1, quantity: 1});
export const Product = mongoose.model("Product", productSchema)