const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const CourseType = require('../types/courseType');
const StudentType = require('../types/studentType');
const GradeType = require('../types/gradeType');

const courses = require('../../data/Course.json');
const students = require('../../data/Student.json');
const grades = require('../../data/Grade.json');

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addCourse: {
            type: CourseType,
            description: 'Add a course',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const course = {
                    id: courses.length, // I started with 0 all IDs
                    name: args.name,
                    description: args.description
                };
                courses.push(course);
                return course;
            }
        },

        addStudent: {
            type: StudentType,
            description: 'Add a student',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                courseId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                let result = false;

                courses.map( course => {
                    if(course.id === args.courseId) {
                        const student = {
                            id: students.length,
                            name: args.name,
                            lastname: args.lastname,
                            courseId: args.courseId
                        }
                        students.push(student);
                        result = student;
                    }
                });

                if (result) {
                    return result;
                } else {
                    throw new Error(`The course doesn't exist.`);
                }
            }
        },

        addGrade: {
            type: GradeType,
            description: 'Add a grade',
            args: {
                grade: { type: GraphQLNonNull(GraphQLInt) },
                courseId: { type: GraphQLNonNull(GraphQLInt) },
                studentId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                let result = false;
                courses.map( course => {
                    if(course.id === args.courseId) {
                        students.map( student => {
                            if (student.id === args.studentId) {
                                const grade = {
                                    id: grades.length,
                                    grade: args.grade,
                                    courseId: args.courseId,
                                    studentId: args.studentId
                                }
                                grades.push(grade);
                                result = grade;
                            }
                        })
                    }
                })

                if (result) {
                    return result;
                } else {
                    throw new Error(`Verify if the student is assigned to the course or if the student and the course both exist`);
                }
            }
        },

        deleteCourse: {
            type: CourseType,
            description: 'Delete a course',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) => {
                let exist = false;
                students.map( student => {
                    if (student.courseId === args.id) {
                        exist = true;
                    }
                })

                if(exist) {
                    throw new Error(`There are associate students! You must remove them first`);
                } else {
                    let remove = _.remove(courses, (course) => {
                        return course.id === args.id;
                    });
                    
                    return remove;
                }
            }
        },

        deleteStudent: {
            type: StudentType,
            description: 'Delete a student',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) => {
                let exist = false;
                grades.map( grade => {
                    if (grade.studentId === args.id) {
                        exist = true;
                    }
                })

                if(exist) {
                    throw new Error(`There are associate grades! You must remove them first`);
                } else {
                    let remove = _.remove(students, (student) => {
                        return student.id === args.id;
                    });
                    
                    return remove;
                }
            }
        },
        
        deleteGrade: {
            type: GradeType,
            description: 'Delete a grade',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) => {

                const remove = _.remove(grades, (grade) => {
                    return grade.id === args.id;
                });
                
                return remove;
            }
        },

    })
});

module.exports = RootMutationType;