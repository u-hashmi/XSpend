import { StyleSheet } from 'react-native';

const GlobalStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  container: {
    padding: theme.SIZES.marginSmall,
  },
  sectionHeader: {
    fontFamily: 'Gabarito-Bold',
    fontSize: theme.SIZES.fontMedium,
    paddingBottom: theme.SIZES.paddingSmall,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noMargin:{
    margin: 0,
  },
  alignLeft: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  iconContainer: {
    padding: theme.SIZES.paddingSmall,
    marginRight: theme.SIZES.marginSmall,
    borderRadius: theme.SIZES.radiusSmall,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  infoBoxContainer: {
    margin: theme.SIZES.marginSmall,
    padding: theme.SIZES.paddingSmall,
    borderRadius: theme.SIZES.radiusSmall,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoBox: {
    width: 100,
    height: 100,
    padding: theme.SIZES.paddingSmall,
    borderRadius: theme.SIZES.radiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryPanel: {
    margin: theme.SIZES.marginSmall,
    padding: theme.SIZES.paddingSmall,
    borderRadius: theme.SIZES.radiusSmall,
    flexDirection: 'column',
  },
  categoryEntry: {
    marginBottom: theme.SIZES.marginSmall,
    borderRadius: theme.SIZES.radiusSmall,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryItems: {
    borderRadius: theme.SIZES.radiusXSmall,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SIZES.paddingMedium,
    borderWidth: 1,
  },
  superScriptStyle: {
    fontFamily: 'Arial',
  },
  textLeft:{
    justifyContent: 'center',
    alignItems: 'flex-end',
    textAlign: 'left',
  },
  spaceBetween: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default GlobalStyles;
