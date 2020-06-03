const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const CourseType = require('./courseType');
const StudentType = require('./studentType');

const courses = require('../../data/Course.json');
const students = require('../../data/Student.json');

const GradeType = new GraphQLObjectType({
    name: 'Grade',
    description: 'Represent grades',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        grade: { type: GraphQLNonNull(GraphQLInt) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        course: {
            type: CourseType,
            resolve: (grade) => {
                return courses.find(course => course.id === grade.courseId)
            }
        },
        studentId: { type: GraphQLNonNull(GraphQLInt) },
        student: {
            type: StudentType,
            resolve: (grade) => {
                return students.find(student => student.id === grade.studentId)
            }
        }
    })
});

module.exports = GradeType;