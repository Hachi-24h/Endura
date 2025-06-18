// Css/vocabularyStyle.ts
import { StyleSheet } from 'react-native';
import color from '../Custom/Color';
import { height } from '../utils/config';


export const cardStyles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    height: height * 0.7,
    alignSelf: 'center',
    backgroundColor: color.white,
    borderRadius: height * 0.05,
    shadowColor: color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',

  },
  front: {
    backgroundColor: color.primary,
  },
  back: {
    backgroundColor: color.white,
    transform: [{ rotateY: '180deg' }],
  },
  wordText: {
    fontSize: 32,
    color: color.lightRed,
    fontWeight: 'bold',
  },
  meaningText: {
    fontSize: height * 0.04,
    // color: color.lightyellow,
    color:"#00000",
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  subInfo: {
    fontSize: height * 0.02,
    color: color.lightyellow,
    marginTop: height * 0.01,
    fontWeight:"500",
    textAlign: 'center',
  }
});

export const screenStyles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    height: height,
    backgroundColor: color.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    marginTop: height * 0.02,
    fontSize: height * 0.02,
    color: color.primary,
  },
});
