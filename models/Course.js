const mongoose = require('mongoose');
const { castObject } = require('./Bootcamp');


const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: [true, 'Please add a course title']
    },
    description: {
        type: String,
        require: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        require: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        require: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        require: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false
    },
    creatAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        require: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      }
});

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {

    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {$avg: '$tuition'}
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) *10
        })
    } catch (error) {
        çonsole.error(error);
    }
}

// Call getAvarageCost after save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAvarageCost after save
CourseSchema.pre('deleteOne', function() {
    this.constructor.getAverageCost(this.bootcamp);
});


module.exports = mongoose.model('Course', CourseSchema);