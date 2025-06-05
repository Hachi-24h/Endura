import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
import color from '../Custom/Color';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: color.white,
    width: width,
    height: height,

  },
  header: {
    flexDirection: 'column',
    width: width * 0.9, // Giảm width xuống để có khoảng cách với mép phải
    height: height * 0.2,
    backgroundColor: color.lightBlue,
    marginTop: height * 0.01,
    marginHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.05,
  },
  box1: {
    flexDirection: 'row',
    marginBottom: height * 0.03,
  },
  avt:{
    width: width * 0.18,
    height: width * 0.18,
  },
  button1: {
    width: width * 0.1,
    height: width * 0.1,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box1_inner: {
    flexDirection: 'column',
    width: "100%",
    marginTop: height * 0.005,


  },
  box2: {
    flexDirection: 'row',
  },
  box2_search: {
    flexDirection: 'row',
    width: width * 0.8,
    height: height * 0.05,
    backgroundColor: color.white,
    borderRadius: width * 0.05,
    marginHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box2_search_input: {
    width: width * 0.7,
    height: height * 0.05,
    fontSize: width * 0.04,
    paddingLeft: width * 0.02,
  },
  body: {
    flexDirection: 'column',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  searchBar: {
    width: "100%",
    backgroundColor: "#F2F2F2",
    borderRadius: width * 0.05,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
  },
  titleMain: {
    width: "100%",
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: color.orange,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.01,
    
  },
  filterColumn: {
    width: "50%",
    height:"100%",
    flexDirection: "column",
    backgroundColor: color.white,
  },
  filter_1: {
    flexDirection: "row",
    margin: width * 0.01,
    
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginRight: width * 0.02,
  },
  filterText: {
    fontSize: width * 0.04,
    marginTop: height * 0.03,
    color: color.darkGreen,
    fontStyle: "italic",
  },
  card: {
    width: width * 0.8,
    paddingVertical: height * 0.03,
    borderRadius: width * 0.05,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
    alignItems: "center",
    filterColumn: "column",
    marginHorizontal: width * 0.085,
  },
  courseImg: {
    width: width * 0.4,
    height: height * 0.2,
    resizeMode: "cover",
    
  },
  courseTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#fff",
  },
  courseSubtitle: {
    fontSize: width * 0.04,
    color: "#fff",
    opacity: 0.8,
    marginBottom: height * 0.01,
  },
  courseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  infoText: {
    fontSize: width * 0.04,
    color: "#fff",
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.02,
    marginTop: 0,
    
  },
  slideContainer: {
    width: width*0.96,
    height: height * 0.35,
    marginTop: height * 0.02,
   
  },
  dot: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    marginHorizontal: width * 0.015,
  },
  wordContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "center",
    width: width * 0.9,
    height: height * 0.1,
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.05,
 
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.05,
    paddingVertical: height * 0.007,
  },
  word: {
    fontSize: width * 0.05,
    color: color.black,
   fontWeight: "bold",
    textAlignVertical: "center",
  },
  meaning: {
    fontSize: width * 0.04,
    color: color.black,
    opacity: 0.8,
    textAlignVertical: "center",
    textAlign: "right",
    width: width * 0.8,
    fontStyle: "italic",
  },
 
  shadowEffect: {
    shadowColor: color.blue,
    elevation: 8,
    
},
});

export default styles;
