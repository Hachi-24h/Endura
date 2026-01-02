import { StyleSheet } from 'react-native';
import color from '../Custom/Color';


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  form: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 12,
    color: color.blue,
  },
  subTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: color.darkgray,
  },
  input: {
    backgroundColor: color.white,
    borderColor: color.gray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  checkboxWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  checkboxItem: {
    width: '48%',
    marginVertical: 4,
  },
  addButton: {
    backgroundColor: color.blue,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    color: color.white,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: color.darkgray,
  },
  vocabCard: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.blue,
  },
  meaning: {
    fontSize: 16,
    marginVertical: 4,
  },
  meta: {
    fontSize: 14,
    color: color.darkgray,
  },
  newBadge: {
    marginTop: 4,
    color: color.red,
    fontWeight: 'bold',
  },
});
