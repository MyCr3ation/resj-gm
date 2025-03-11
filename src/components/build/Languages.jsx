import { useState } from "react";
import toast from "react-hot-toast";
// import { useLocale, useTranslations } from "next-intl";
import useStore from "../../store/store";
import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";
import Example from "../shared/Example";
import { LANGUAGE_OPTIONS } from "../../utils/constants";
import { handleMoveItem } from "../../utils/helpers";
import { MdPlayArrow } from "react-icons/md";
import { TbProgress } from "react-icons/tb";

const Languages = () => {
  // Simple translation function replacement
  const t = (key) => key;
  // Simple locale replacement
  const locale = "en";
  const {
    store: { languages },
    addItem,
    editItem,
    removeItem,
    updateOrder,
  } = useStore();

  const [show, setShow] = useState(false);

  const [newLanguage, setNewLanguage] = useState({
    language: "",
    level: "",
  });

  const handleAddLanguage = () => {
    if (newLanguage.language && newLanguage.level) {
      addItem("languages", newLanguage);
      setNewLanguage({
        language: "",
        level: "",
      });
    } else {
      toast.error(t("error"));
    }
  };

  const handleRemoveLanguage = (index) => {
    removeItem("languages", index);
  };

  //* Edit
  const [editedIndex, setEditedIndex] = useState(null);
  const handleEditLanguage = () => {
    try {
      editItem("languages", editedIndex, newLanguage);
      toast.success(t("success"));
      setEditedIndex(null);
      setNewLanguage({
        language: "",
        level: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  const handleChooseLanguage = (index) => {
    setEditedIndex(index);
    const languageItem = languages[index];
    setNewLanguage({
      language: languageItem.language,
      level: languageItem.level,
    });
  };

  const handleCloseEdit = () => {
    setEditedIndex(null);
    setNewLanguage({
      language: "",
      level: "",
    });
  };

  //* Sort
  const handleMoveLanguageUp = (index) => {
    handleMoveItem(languages, updateOrder, index, "up", "languages");
  };

  const handleMoveLanguageDown = (index) => {
    handleMoveItem(languages, updateOrder, index, "down", "languages");
  };

  //* ISO
  // const locale = useLocale(); // Using hardcoded locale from above

  return (
    <div className="flex flex-col gap-2 border-b border-dashed border-gray-400">
      <h2
        className="font-bold text-xl text-main hover:text-main/80 animation-all mb-4 cursor-pointer flex items-center gap-1"
        onClick={() => setShow(!show)}
      >
        {t("title")}
        <MdPlayArrow
          size={18}
          className={`mt-1 animation-all ${show ? "rotate-90" : ""}`}
        />
      </h2>

      {show && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              state={newLanguage.language}
              setState={(value) =>
                setNewLanguage({ ...newLanguage, language: value })
              }
              name="language"
              label={t("language") + "*"}
            />
            <Select
              options={LANGUAGE_OPTIONS}
              state={newLanguage.level}
              setState={(value) =>
                setNewLanguage({ ...newLanguage, level: value })
              }
              name="level"
              label={t("level") + "*"}
            />
          </div>

          <Button
            onClick={() =>
              editedIndex === null ? handleAddLanguage() : handleEditLanguage()
            }
          >
            {t(editedIndex !== null ? "edit" : "add")}
          </Button>
          {editedIndex !== null && (
            <Button onClick={() => handleCloseEdit()}>{t("close")}</Button>
          )}

          {/* List */}
          <div className="my-6">
            {languages.length > 0 && (
              <div className="space-y-4 text-white/80">
                {languages.map((lang, index) => (
                  <Example
                    key={index}
                    index={index}
                    remove={handleRemoveLanguage}
                    edit={handleChooseLanguage}
                    down={handleMoveLanguageDown}
                    up={handleMoveLanguageUp}
                    title={lang.language}
                    state={languages}
                  >
                    <p className="flex items-center gap-1">
                      <strong className="text-main">
                        <TbProgress />
                      </strong>{" "}
                      {t(lang.level)}
                    </p>
                  </Example>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Languages;
