import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedTopicIds: [{ type: String }],
    completionPercent: { type: Number, default: 0 },
    lastViewedTopicId: { type: String },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

export const Progress = mongoose.model('Progress', progressSchema);
