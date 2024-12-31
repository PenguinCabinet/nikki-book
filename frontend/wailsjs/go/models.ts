export namespace main {
	
	export class Nikki_date_t {
	    Year: number;
	    Month: number;
	    Day: number;
	
	    static createFrom(source: any = {}) {
	        return new Nikki_date_t(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Year = source["Year"];
	        this.Month = source["Month"];
	        this.Day = source["Day"];
	    }
	}
	export class Nikki_t {
	    Fname: string;
	    Date: Nikki_date_t;
	    Content: string;
	    Is_loading: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Nikki_t(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Fname = source["Fname"];
	        this.Date = this.convertValues(source["Date"], Nikki_date_t);
	        this.Content = source["Content"];
	        this.Is_loading = source["Is_loading"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Setting_t {
	    Nikki_dir: string;
	    Fname_format: string;
	
	    static createFrom(source: any = {}) {
	        return new Setting_t(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Nikki_dir = source["Nikki_dir"];
	        this.Fname_format = source["Fname_format"];
	    }
	}

}

