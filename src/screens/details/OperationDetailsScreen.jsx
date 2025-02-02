import { Text, StyleSheet, Pressable, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { BaseView, IconGlob, STHeader } from '@components'
import { useCurrentTheme, useHeaderStyles } from 'hooks';
import { PencilIcon } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { accountsSelectors, categoriesSelectors, operationsSelectors } from '@redux';
import SetOperationSheet from 'src/components/sheets/SetOperationSheet';
import ValueMask from 'src/components/styling/ValueMask';
import ZigzagLines from "react-native-zigzag-lines"
import DeleteBtnSheet from 'src/components/sheets/DeleteBtnSheet';
import { operationsActions } from '@actions';
import { useTranslation } from 'react-i18next';

const OperationDetailsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [themeColors] = useCurrentTheme();
  const { headerStyles } = useHeaderStyles();
  const [width, setWidth] = useState()


  const item = useSelector((s) => operationsSelectors.selectOperationByID(s, route.params.item.id))
  const categoryItem = useSelector((s) => categoriesSelectors.selectCategoryByID(s, item?.categoryID))
  const accountItem = useSelector((s) => accountsSelectors.selectAccountByID(s, item?.accountID))


  const [isSheetOpen, toggleSheetOpen] = React.useState(false);
  const toggleSheet = () => {
    toggleSheetOpen(!isSheetOpen);
  };


   const RenderCategoryOrAccount = ({ icon, color, title, styles }) => (
    <View style={styles.categoryBlock}>
      <View style={styles.icon}>
        <IconGlob name={icon} color={color} size={20} />
        <View style={[styles.icon_bg, { backgroundColor: color || themeColors.thumbBackground }]} />
      </View>

      <Text style={styles.valueText}>{title}</Text>
    </View>
  )


  const styles = StyleSheet.create({
    content: {
      paddingHorizontal: 20,
      paddingTop: 5,
      paddingBottom: 20
    },
    content_wrapper: {
      marginHorizontal: 10,
      marginVertical: 20,
      borderWidth: 2.2,
      borderColor: themeColors.borderColorSec,
      borderBottomWidth: 0,
      borderTopWidth: 0,
    },
    text: {
      color: themeColors.textColorHighlight
    },
    valueText: {
      color: themeColors.chevronText
    },
    icon: {
      width: 30,
      height: 30,
      marginRight: 8,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      overflow: "hidden"
    },
    icon_bg: {
      position: "absolute",
      ...StyleSheet.absoluteFill,
      zIndex: -1,
      opacity: categoryItem?.color ? (themeColors.label === "dark" ? 0.2 : 0.1) : 1,
    },
    categoryBlock: {
      flexDirection: "row",
      alignItems: 'center',
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      height: 48,
    },
    contentText: {
      flex: 1,
      fontSize: 15,
      fontWeight: "500",
      color: themeColors.textColorHighlight
    },
    deleteBtn: {
      padding: 10,
      fontWeight: "500",
      fontSize: 16,
      color: themeColors.red,
      alignSelf:"center"
    }
  });


  if(!item) return null;

  const renderHeaderButton = (
    <View style={[headerStyles.rightComponent]}>
      <Pressable
        style={[headerStyles.headerButton]}
        onPress={toggleSheet}
      >
        <PencilIcon
          style={{ marginLeft: 1, marginTop: 0, alignSelf: "center" }}
          width={25}
          height={55}
          strokeWidth={2.1}
          stroke={themeColors.textColorHighlight}
        />
      </Pressable>
    </View>
  )

  return (
    <BaseView>
      <STHeader
        title={t("ods_title")}
        rightComponent={renderHeaderButton}
        navigation={navigation} />


      <ScrollView>
        <View onLayout={e => setWidth(e.nativeEvent.layout.width)}>


        <View style={styles.content_wrapper}>
          {typeof width == 'number' && <ZigzagLines
            width={width}
            color={themeColors.borderColorSec}
          />}

          <View style={styles.content} >
            <View style={styles.item}>
              <Text style={styles.contentText}>{t("tt_title")}</Text>
              <Text style={styles.valueText}>{item.title || t("tt_operation")?.toTitleCase()}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.contentText}>{t("tt_description")}</Text>
              <Text style={styles.valueText}>{item.desc || t("tt_nodescription")}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.contentText}>{t("tt_value")}</Text>
              <ValueMask {...{ value: (item.value || "0") + " " + item.currency, type: item.type, style: {fontSize: 18, fontWeight: "500"} }} />
            </View>

            <View style={styles.item}>
              <Text style={styles.contentText}>{t("tt_operationtype")}</Text>
              <Text style={styles.valueText}>{t(item.type).toUpperCase()}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.contentText}>{t("tt_date")}</Text>
              <Text style={styles.valueText}>{item.timestamp}</Text>
            </View>


            <View style={styles.item}>
              <Text style={styles.contentText}>{t("tt_category")}</Text>
              <RenderCategoryOrAccount {...{ icon: categoryItem?.icon, styles, color: categoryItem?.color, title: categoryItem?.title?.startsWith("ct_def_") ? t(categoryItem?.title) : categoryItem?.title || t("tt_category__none") }} />
            </View>

            <View style={styles.item}>
              <Text style={styles.contentText}>{t("tt_account")}</Text>
              <RenderCategoryOrAccount {...{ icon: accountItem?.icon, styles, color: accountItem?.color, title: accountItem?.title?.startsWith("ct_def_") ? t(accountItem?.title) : accountItem?.title || t("tt_account__none") }} />
            </View>
          </View>


          {typeof width == 'number' && <ZigzagLines
            position="bottom"
            width={width}
            color={themeColors.borderColorSec}
          />}
          </View>


          <DeleteBtnSheet
            marginTop={0}
            itemTitle={item.title || ""}
            tKey={"deleteOperationMessage"}
            setHeight={350}
            sheetTitle={t("st_del_operation")}
            action={() => {dispatch(operationsActions.deleteOperation(item.id)); navigation.goBack()}}
          />

        </View>
      </ScrollView>

      <SetOperationSheet {...{
        isOpen: isSheetOpen,
        toggleSheet,
        isEdit: true,
        item
      }} />
    </BaseView>
  )
}

export const RenderCategoryOrAccount = ({ icon, color, title, styles }) => {
  const {t} = useTranslation();
  return (
  <View style={styles.categoryBlock}>
    <View style={styles.icon}>
      <IconGlob name={icon} color={color} size={20} />
      <View style={[styles.icon_bg, { backgroundColor: color || themeColors.thumbBackground }]} />
    </View>

    <Text style={styles.valueText}>{title.startsWith("ct_def_") ? t(title) : title || "no data"}</Text>
  </View>
)}

export default OperationDetailsScreen