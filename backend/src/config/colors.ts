import { registerAs } from "@nestjs/config";

/**
 * An object containing color information for various colors used in the application.
 * Each color is represented by a key-value pair, where the key is the color code and the value is an object containing the color name and an array of hexadecimal color codes.
 * 
 * @example
 * {
 *   "BU": {name: "Blue", code: "BU", colour: ["#405197"]},
 *   "CAM": {name: "Camouflage", code: "CAM", colour: ["#8C9458","#D9D189","#4C5B44","#1E2E21"]},
 *   ...
 * }
 */
export default registerAs('colors',() => ({
    /**
     * Blue color
     */
    "BU": {name: "Blue", code: "BU", colour: ["#405197"]},

    /**
     * Camouflage color
     */
    "CAM": {name: "Camouflage", code: "CAM", colour: ["#8C9458","#D9D189","#4C5B44","#1E2E21"]},

    /**
     * Olive color
     */
    "OL": {name: "Olive", code: "OL", colour: ["#5D6117"]},

    /**
     * Gold color
     */
    "GD": {name: "Gold", code: "GD", colour: ["#FFE516"]},

    /**
     * Black Cyan color
     */
    "BLC": {name: "Black Cyan", code: "BLC", colour: ["#000000","#00B2E2"]},

    /**
     * Light Green color
     */
    "LG": {name: "Light Green", code: "LG", colour: ["#c6d1c5"]},

    /**
     * Off White color
     */
    "OW": {name: "Off White", code: "OW", colour: ["#FAFAFA"]},

    /**
     * Dark Green color
     */
    "DG1": {name: "Dark Green", code: "DG1", colour: ["#0D331E"]},

    /**
     * Fuscia color
     */
    "F": {name: "Fuscia", code: "F", colour: ["#D04598"]},

    /**
     * Natural color
     */
    "NT": {name: "Natural", code: "NT", colour: ["#CBC4BA"]},

    /**
     * Navy Navy color
     */
    "NN": {name: "Navy Navy", code: "NN", colour: ["#262449","#2d2a67"]},

    /**
     * Purple color
     */
    "P": {name: "Purple", code: "P", colour: ["#4E377F"]},

    /**
     * White Navy color
     */
    "WN": {name: "White Navy", code: "WN", colour: ["#FFFFFF","#262449"]},

    /**
     * Grey Orange color
     */
    "GYO": {name: "Grey Orange", code: "GYO", colour: ["#76767E","#F96630"]},

    /**
     * Red Black color
     */
    "RBL": {name: "Red Black", code: "RBL", colour: ["#C32130","#231F20"]},

    /**
     * Black Yellow color
     */
    "BLY": {name: "Black Yellow", code: "BLY", colour: ["#231F20","#E6B54C"]},

    /**
     * Navy color
     */
    "N": {name: "Navy", code: "N", colour: ["#262449"]},

    /**
     * Lime color
     */
    "L": {name: "Lime", code: "L", colour: ["#ADCE39"]},

    /**
     * Khaki color
     */
    "KH": {name: "Khaki", code: "KH", colour: ["#D2C3B0"]},

    /**
     * Burnt Orange color
     */
    "BO": {name: "Burnt Orange", code: "BO", colour: ["#cb734f"]},

    /**
     * Navy Light Blue color
     */
    "NLB": {name: "Navy Light Blue", code: "NLB", colour: ["#262449","#AACDED"]},

    /**
     * Ocean Blue color
     */
    "OB": {name: "Ocean Blue", code: "OB", colour: ["#BEC7D6"]},

    /**
     * White color
     */
    "W": {name: "White", code: "W", colour: ["#FFFFFF"]},

    /**
     * White Red color
     */
    "WR": {name: "White Red", code: "WR", colour: ["#FFFFFF","#2F20C3"]},

    /**
     * Grey White color
     */
    "GYW": {name: "Grey White", code: "GYW", colour: ["#76767E","#FFFFFF"]},

    /**
     * Grey Old color
     */
    "GR": {name: "Grey Old", code: "GR", colour: ["#5F605B"]},

    /**
     * Navy Red color
     */
    "NR": {name: "Navy Red", code: "NR", colour: ["#262449","#C32130"]},

    /**
     * Stone color
     */
    "ST": {name: "Stone", code: "ST", colour: ["#BEB8AA"]},

    /**
     * Natural Navy color
     */
    "NTN": {name: "Natural Navy", code: "NTN", colour: ["#CBC4BA","#262449"]},

    /**
     * Green color
     */
    "G": {name: "Green", code: "G", colour: ["#396D56"]},

    /**
     * Brown color
     */
    "BN": {name: "Brown", code: "BN", colour: ["#3F352C"]},

    /**
     * Cream color
     */
    "CM": {name: "Cream", code: "CM", colour: ["#FAE9CD"]},

    /**
     * Yellow color
     */
    "Y": {name: "Yellow", code: "Y", colour: ["#E6B54C"]},

    /**
     * Red color
     */
    "R": {name: "Red", code: "R", colour: ["#C32130"]},

    /**
     * Transparent color
     */
    "T": {name: "Transparent", code: "T", colour: ["#FFFFFF"]},

    /**
     * Gun Metal color
     */
    "GM": {name: "Gun Metal", code: "GM", colour: ["#5F6769"]},

    /**
     * Bronze color
     */
    "BZ": {name: "Bronze", code: "BZ", colour: ["#CD8031"]},

    /**
     * Dark Grey color
     */
    "DG2": {name: "Dark Grey", code: "DG2", colour: ["#454744"]},

    /**
     * Sky Blue color
     */
    "SB": {name: "Sky Blue", code: "SB", colour: ["#247EBC"]},

    /**
     * Grey Red color
     */
    "GYR": {name: "Grey Red", code: "GYR", colour: ["#5F605B","#C32130"]},

    /**
     * Maroon color
     */
    "M": {name: "Maroon", code: "M", colour: ["#622431"]},

    /**
     * Black color
     */
    "BL": {name: "Black", code: "BL", colour: ["#231F20"]},

    /**
     * Black Green color
     */
    "BLG": {name: "Black Green", code: "BLG", colour: ["#231F20","#396D56"]},

    /**
     * Grey color
     */
    "GY": {name: "Grey", code: "GY", colour: ["#5F605B"]},

    /**
     * White Black color
     */
    "WBL": {name: "White Black", code: "WBL", colour: ["#FFFFFF","#231F20"]},

    // Black Lime
    "BLL": {name: "Black Lime", code: "BLL", colour: ["#231F20","#ADCE39"]},
    // Royal Blue White
    "RBW": {name: "Royal Blue White", code: "RBW", colour: ["#2872BB","#FFFFFF"]},
    // Beige
    "BG1": {name: "Beige", code: "BG1", colour: ["#E5E1D5"]},
    // Bright Green
    "BG2": {name: "Bright Green", code: "BG2", colour: ["#3A8028"]},

    /**
     * Aqua color
     */
    "AQ": {name: "Aqua", code: "AQ", colour: ["#61BDD6"]},

    /**
     * Light Blue color
     */
    "LB": {name: "Light Blue", code: "LB", colour: ["#A3C5E1"]},

    /**
     * Navy White color
     */
    "NW": {name: "Navy White", code: "NW", colour: ["#262449","#FFFFFF"]},

    /**
     * Dark Blue color
     */
    "DB": {name: "Dark Blue", code: "DB", colour: ["#565D6F"]},

    /**
     * Black Teal color
     */
    "BLT": {name: "Black Teal", code: "BLT", colour: ["#231F20","#56C4D1"]},

    /**
     * Green Gold color
     */
    "GG": {name: "Green Gold", code: "GG", colour: ["#396D56","#FFE516"]},

    /**
     * Dark Red color
     */
    "DR": {name: "Dark Red", code: "DR", colour: ["#9A1B24"]},

    /**
     * Turquoise color
     */
    "TQ": {name: "Turquoise", code: "TQ", colour: ["#00A6E4"]},

    /**
     * Cyan color
     */
    "CY": {name: "Cyan", code: "CY", colour: ["#01AEF0"]},

    /**
     * Natural Brown color
     */
    "NAT": {name: "Natural Brown", code: "NAT", colour: ["#CBC4BA"]},

    /**
     * Pink color
     */
    "PI": {name: "Pink", code: "PI", colour: ["#F3A9B6"]},

    /**
     * Royal Blue color
     */
    "RB": {name: "Royal Blue", code: "RB", colour: ["#2872BB"]},

    /**
     * Silver color
     */
    "S": {name: "Silver", code: "S", colour: ["#D1DADF"]},

    /**
     * Royal Blue Yellow color
     */
    "RBY": {name: "Royal Blue Yellow", code: "RBY", colour: ["#2872BB","#E6B54C"]},

    /**
     * Solid White color
     */
    "SW": {name: "Solid White", code: "SW", colour: ["#FFFFFF"]},

    /**
     * Black White color
     */
    "BLW": {name: "Black White", code: "BLW", colour: ["#231F20","#FFFFFF"]},

    /**
     * Navy Lime color
     */
    "NL": {name: "Navy Lime", code: "NL", colour: ["#262449","#ADCE39"]},

    /**
     * White Light Blue color
     */
    "WLB": {name: "White Light Blue", code: "WLB", colour: ["#FFFFFF","#ACCDEE"]},

    /**
     * Orange color
     */
    "O": {name: "Orange", code: "O", colour: ["#DC7437"]},

    /**
     * Copper color
     */
    "CP": {name: "Copper", code: "CP", colour: ["#B87331"]},

    /**
     * Grey Lime color
     */
    "GYL": {name: "Grey Lime", code: "GYL", colour: ["#76767E","#A8C841"]},

    /**
     * Black Orange color
     */
    "BLO": {name: "Black Orange", code: "BLO", colour: ["#231F20","#DC7437"]},

    /**
     * Rose Gold color
     */
    "RG": {name: "Rose Gold", code: "RG", colour: ["#B76E79"]},

    /**
     * Charcoal color
     */
    "C": {name: "Charcoal", code: "C", colour: ["#292D2E"]},

    /**
     * Charcoal color
     */
    "CO": {name: "Coral", code: "C", colour: ["#FF4040"]},

    /**
     * Stone Military Green color
     */
    "STMG": {name: "Stone Military Green", code: "STMG", colour: ["#BAB59F"]},

    /**
     * Red White color
     */
    "RW": {name: "Red White", code: "RW", colour: ["#C32130","#FFFFFF"]},

    /**
     * Black Red color
     */
    "BLR": {name: "Black Red", code: "BLR", colour: ["#231F20","#C61E3F"]},

    /**
     * Military Green color
     */
    "MG": {name: "Military Green", code: "MG", colour: ["#4B5320"]},

    /**
     * Light Grey color
     */
    "LGY": {name: "Light Grey", code: "LGY", colour: ["#D3D3D3"]},

    /**
     * Light Turquoise color
     */
    "LT": {name: "Light Turquoise", code: "LT", colour: ["#ACCDEE"]}
}));
