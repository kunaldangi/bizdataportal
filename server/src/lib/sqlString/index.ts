var ID_GLOBAL_REGEXP = /`/g;
var QUAL_GLOBAL_REGEXP = /\./g;
var CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g; // eslint-disable-line no-control-regex
var CHARS_ESCAPE_MAP = {
    '\0': '\\0',
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\r': '\\r',
    '\x1a': '\\Z',
    '"': '\\"',
    '\'': '\\\'',
    '\\': '\\\\'
};

export function escapeIdPostgre(val: any, forbidQualified?: boolean): string {
    if (Array.isArray(val)) {
        var sql = '';

        for (var i = 0; i < val.length; i++) {
            sql += (i === 0 ? '' : ', ') + escapeIdPostgre(val[i], forbidQualified);
        }

        return sql;
    } else if (forbidQualified) {
        return '"' + String(val).replace(ID_GLOBAL_REGEXP, '""') + '"';
    } else {
        return '"' + String(val).replace(ID_GLOBAL_REGEXP, '""').replace(QUAL_GLOBAL_REGEXP, '"."') + '"';
    }
};