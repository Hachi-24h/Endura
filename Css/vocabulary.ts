// Css/vocabularyStyle.ts
import { StyleSheet } from 'react-native';
import color from '../Custom/Color';


export const cardStyles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    height: 250,
    alignSelf: 'center',
    // perspective: 1000,
    marginTop: 60,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    padding: 20,
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
    color: color.white,
    fontWeight: 'bold',
  },
  meaningText: {
    fontSize: 28,
    color: color.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subInfo: {
    fontSize: 16,
    color: color.text,
    marginTop: 4,
    textAlign: 'center',
  }
});

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    marginTop: 20,
    fontSize: 16,
    color: color.primary,
  },
});
